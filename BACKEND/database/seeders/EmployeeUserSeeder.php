<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EmployeeUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            [
                'name' => 'Knoah Mari Staff',
                'email' => 'knoahmari@km100.ph',
                'password' => Hash::make('Employee123!'),
                'role' => 'employee',
                'branch' => 'Knoah Mari',
                'department' => 'Operations',
                'is_active' => true,
            ],
            [
                'name' => 'Red Goose Staff',
                'email' => 'redgoose@km100.ph',
                'password' => Hash::make('Employee123!'),
                'role' => 'employee',
                'branch' => 'Red Goose',
                'department' => 'Operations',
                'is_active' => true,
            ],
            [
                'name' => 'PETC Emission Staff',
                'email' => 'petc@km100.ph',
                'password' => Hash::make('Employee123!'),
                'role' => 'employee',
                'branch' => 'PETC',
                'department' => 'Inspection',
                'is_active' => true,
            ],
        ];

        foreach ($employees as $employee) {
            User::updateOrCreate(
                ['email' => $employee['email']],
                $employee
            );
        }
    }
}
