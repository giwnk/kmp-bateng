<?php

namespace App\Enums;

enum LaporanStatus: string
{
    case DRAFT = 'Draft';
    case SUBMITTED = 'Submitted';
    case APPROVED = 'Approved';
    case REJECTED = 'Rejected';

    // Bonus: Fungsi buat dapetin label warna untuk UI
    public function color(): string
    {
        return match($this) {
            self::DRAFT => 'gray',
            self::SUBMITTED => 'blue',
            self::APPROVED => 'emerald',
            self::REJECTED => 'red',
        };
    }

    public function label(): string{
        return match($this) {        
            self::DRAFT => 'Draf',
            self::SUBMITTED => 'Terkirim',
            self::APPROVED => 'Disetujui',
            self::REJECTED => 'Ditolak',
        };
    }

    
}