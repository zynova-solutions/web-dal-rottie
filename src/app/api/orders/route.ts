import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || undefined;

    // Prepare payment initiation payload
    const paymentPayload = {
      orderItems: body.orderItems,
      currency: body.currency || 'EUR',
      deliveryAddress: body.deliveryAddress,
      area: body.area,
      postalCode: body.postalCode,
      latitude: body.latitude,
      longitude: body.longitude,
      name: body.name,
      email: body.email,
      phoneNo: body.phoneNo,
      totalAmount: body.totalAmount,
      paymentType: body.paymentType || 'SumUp',
      notes: body.notes,
      couponCode: body.couponCode,
    };

    // Call payment initiation API
    const response = await fetch(`${API_BASE_URL}/api/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(paymentPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { 
          success: false, 
          error: errorData?.message || 'Payment initiation failed',
          details: errorData 
        }, 
        { status: response.status }
      );
    }

    const paymentResponse = await response.json();

    // If payment initiation is successful, return the response
    // The order will be created by the backend after successful payment
    return NextResponse.json({ 
      success: true, 
      data: paymentResponse 
    });

  } catch (error) {
    console.error('Error in order creation:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' }, 
      { status: 500 }
    );
  }
}
