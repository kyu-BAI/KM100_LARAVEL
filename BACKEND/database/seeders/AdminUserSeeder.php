<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@km100.ph'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('Admin123!'),
                'role' => 'admin',
                'branch' => 'All',
                'department' => 'Administration',
                'is_active' => true,
            ]
        );
    }
}
