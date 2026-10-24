<?php

namespace App\Models;

use Database\Factories\ServiceRequestFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ServiceRequest extends Model
{
    /** @use HasFactory<ServiceRequestFactory> */
    use HasFactory;

    protected $fillable = ['public_id', 'family_user_id', 'care_recipient_id', 'caregiver_profile_id', 'service_type', 'starts_at', 'ends_at', 'location_area', 'address_encrypted', 'amount_cents', 'status'];

    protected function casts(): array
    {
        return ['starts_at' => 'datetime', 'ends_at' => 'datetime', 'address_encrypted' => 'encrypted'];
    }

    public function family(): BelongsTo
    {
        return $this->belongsTo(User::class, 'family_user_id');
    }

    public function careRecipient(): BelongsTo
    {
        return $this->belongsTo(CareRecipient::class);
    }

    public function caregiverProfile(): BelongsTo
    {
        return $this->belongsTo(CaregiverProfile::class);
    }

    public function paymentAuthorization(): HasOne
    {
        return $this->hasOne(PaymentAuthorization::class);
    }

    public function service(): HasOne
    {
        return $this->hasOne(Service::class);
    }
}
