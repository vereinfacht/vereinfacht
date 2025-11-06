<?php

namespace App\JsonApi\Filters;

use LaravelJsonApi\Eloquent\Contracts\Filter;
use LaravelJsonApi\Eloquent\Filters\Concerns\IsSingular;
use LaravelJsonApi\Eloquent\Filters\Concerns\DeserializesValue;

class QueryFilter implements Filter
{
    use DeserializesValue;
    use IsSingular;

    /**
     * @var string
     */
    private string $name;

    /**
     * @var array
     */
    private array $columns;

    /**
     * @var array
     */
    private array $currencyColumns;

    /**
     * Create a new filter.
     *
     * @param string $name
     * @param array $columns
     * @param array $currencyColumns
     * @return QueryFilter
     */
    public static function make(string $name, array $columns = [], array $currencyColumns = []): self
    {
        return new static($name, $columns, $currencyColumns);
    }

    /**
     * QueryFilter constructor.
     *
     * @param string $name
     * @param array $columns
     * @param array $currencyColumns
     */
    public function __construct(string $name, array $columns = [], array $currencyColumns = [])
    {
        $this->name = $name;
        $this->columns = $columns;
        $this->currencyColumns = $currencyColumns;
    }

    /**
     * Get the key for the filter.
     *
     * @return string
     */
    public function key(): string
    {
        return $this->name;
    }

    /**
     * Apply the filter to the query.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param mixed $value
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function apply($query, $value)
    {
        if (empty($this->columns)) {
            return $query;
        }

        return $query->where(function ($query) use ($value) {
            $isFirstCondition = true;

            foreach ($this->columns as $column) {
                if (in_array($column, $this->currencyColumns)) {
                    // Handle currency columns - convert formatted currency to cents for searching
                    $centValues = $this->convertToCents($value);

                    foreach ($centValues as $centValue) {
                        if ($isFirstCondition) {
                            $query->where($column, 'like', "%{$centValue}%");
                            $isFirstCondition = false;
                        } else {
                            $query->orWhere($column, 'like', "%{$centValue}%");
                        }
                    }
                } else {
                    // Handle regular text columns
                    if ($isFirstCondition) {
                        $query->where($column, 'like', "%{$value}%");
                        $isFirstCondition = false;
                    } else {
                        $query->orWhere($column, 'like', "%{$value}%");
                    }
                }
            }
        });
    }

    /**
     *
     * @param mixed $value
     * @return int
     */
    public static function currencyToCents($value): int
    {
        return round(floatval($value) * 100);
    }

    /**
     *
     * @param string $value
     * @return array
     */
    private function convertToCents(string $value): array
    {
        $centValues = [];
        $cleanValue = preg_replace('/[€$£¥₹\s]/', '', $value);

        if (empty($cleanValue)) {
            return [];
        }

        $patterns = [
            '/(\d+),(\d{1,2})\b/',
            '/(\d+)\.(\d{1,2})\b/',
            '/^(\d+)$/'
        ];

        foreach ($patterns as $pattern) {
            if (preg_match_all($pattern, $cleanValue, $matches, PREG_SET_ORDER)) {
                foreach ($matches as $match) {
                    if (isset($match[2])) {
                        $decimalValue = floatval($match[1] . '.' . str_pad($match[2], 2, '0', STR_PAD_RIGHT));
                        $centValues[] = self::currencyToCents($decimalValue);
                    } else {
                        $number = (int) $match[1];

                        if ($number < 10000) {
                            $centValues[] = self::currencyToCents($number);
                        }

                        $centValues[] = $number;
                    }
                }
            }
        }

        if (empty($centValues) && preg_match('/\d+/', $cleanValue, $matches)) {
            $number = (int) $matches[0];
            $centValues[] = $number;

            if ($number < 10000) {
                $centValues[] = self::currencyToCents($number);
            }
        }

        return array_unique($centValues);
    }
}
