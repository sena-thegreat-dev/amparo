<?php

namespace App\Models;

use Database\Factories\OccurrenceFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Occurrence extends Model
{
    /** @use HasFactory<OccurrenceFactory> */
    use HasFactory;
}
