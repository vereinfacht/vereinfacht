# vereinfacht Changelog
## [0.1.0] - 2026-02-10

### 🚀 Features

- Make open source 🚀
- Basic account management, refs #1
- Introduce sorting and filtering to contact table, refs #3 (#4)
- Implement user management features (#11)
- Open source preparations, refs #5
- Include files and changes required for a release on openCode.de (#16)
- Enhance pagination logic to display all pages when total pages equal or less than 5 (#17)
- Basic create contact page, refs #21
- Introduce basic user create form, refs #27 (#28)
- Basic receipts management, refs #35 (#36)
- Establish receipts relationship in finance contacts (#41)
- Introduce belong to multi input component, refs #46 (#47)
- Implement create and edit form structure with api handling, refs #32
- Create and deactivate finance accounts as transaction sources, refs #52
- Improve receipt management with create and update, refs #54
- Improve finance account management, refs #52 (#62)
- Introduce file upload functionality (#64)
- Add softwareVersion key to publiccode.yml
- Improve receipts table (#69)
- Implement transaction creation functionality (#67)
- Backend file upload handling, refs #63
- Add import transactions functionality with file upload support, refs #74
- Introduce new tax account model, refs #85 (#86)
- Introduce belongs to many cell component, refs #59 (#93)
- Custom tax accounts management, refs #90 (#91)
- Statement import backend implementation, refs #77 (#79)
- Implement delete functionality for tax accounts, refs #97 (#98)
- Add tax account chart source to club, refs #96 (#99)
- Support collective statement import, refs #95 (#102)
- Introduce date range picker component, refs #106 (#108)
- Implement user creation and update functionality, refs #51 (#53)
- Add UI for exporting receipts data as CSV, refs #105 (#109)
- Support CAMT files import, refs #118 (#119)
- Add tax account chart select to admin panel (#139)
- Add missing translations for search functionality, refs #135 (#144)
- Introduce table export functionality, refs #105 (#147)
- Upgrade to filament v5, refs #160
- Improve table export, refs #162 (#163)
- Switch from scheduled to immediate media preview generation, refs #167 (#168)
- Add release workflow (#169)

### 🐛 Bug Fixes

- Publiccode logo path, refs #8
- Use correct translation keys for gender, refs #25
- Filament login fail after refactor of super admin check, refs #23
- Resources edit form error, enhance data attributes for e2e testing, refs #33 (#34)
- Membership type resource validation in Filament, refs #43
- Add type attribute to CancelButton (#61)
- UI not clickable when closing account dialog, refs #73
- Errors on web application build, refs #81
- API php tests are failing, refs #83
- Statement import, refs #95 (#101)
- Prevent enter key form going back, refs #133 (#142)
- Remove empty brackets from transaction option title display (#141)
- Allow initial balance to be zero when created (#143)
- Prevent components from switching to dark mode, refs #130 (#155)
- Build error (#164)

### 🚜 Refactor

- Introduce new statement model, refs #78
- Remove transaction views and forms, refs #94 (#100)

### ⚙️ Miscellaneous Tasks

- Update README.md (#13)
- Use a png as logo for the publiccode.yml, refs #8
- Improve user management, refs #12
- Introduce data attributes for e2e tests, refs #30 (#31)
- Add basic receipt test (#39)
- Improve receipt table, refs #42 (#44)
- Improve transactions table, refs #48 (#49)
- Improve receipt create form, refs #54 (#57)
- Introduce searching for formatted currency values to QueryFilter, refs #87 (#88)
- Improve header sorting logic (#113)
- Implement user tests, refs #111 (#112)
- Add data-cy attributes for e2e testing (#115)
- Prevent demo club emails from being sent (#137)
- Upgrade Laravel version to 12, refs #116 (#117)
- Upgrade to tailwindcss v4, refs #150 (#152)
- Update backend dependencies (#154)
- Update backend dependencies (#156)
- Improve media upload functionality, refs #148 #146 #128 #124 (#151)
- Upgrade to filament v4, refs #140 (#149)
