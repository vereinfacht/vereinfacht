<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class FakeTaxAccountSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = storage_path('app/seed/skr03.json');
        $json = json_decode(File::get($jsonPath), true);

        $tree = $json['tree'] ?? [];

        $accounts = [];
        $this->extractAccounts($tree, $accounts);

        foreach ($accounts as $account) {
            DB::table('tax_accounts')->insert([
                'name' => 'SKR03',
                'reference_number' => $account['account_number'],
                'description' => $account['description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function extractAccounts(array $node, array &$accounts): void
    {
        foreach ($node as $key => $value) {
            if (in_array($key, ['root_type', 'is_group', 'account_type'])) {
                continue;
            }

            if (is_array($value) && isset($value['account_number'])) {
                $accounts[] = [
                    'account_number' => $value['account_number'],
                    'description' => $key,
                ];
            }

            if (is_array($value)) {
                $this->extractAccounts($value, $accounts);
            }
        }
    }
}
