<?php

namespace App\Models;

use Database\Factories\PaymentAuthorizationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentAuthorization extends Model
{
    /** @use HasFactory<PaymentAuthorizationFactory> */
    use HasFactory;
}
