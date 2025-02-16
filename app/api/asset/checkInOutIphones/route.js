import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request) {
  try {
    const { id, action, userId } = await request.json();

    if (!id || !action || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the current iPhone
    const iphone = await prisma.iphone.findUnique({
      where: { id }
    });

    if (!iphone) {
      return NextResponse.json(
        { error: 'iPhone not found' },
        { status: 404 }
      );
    }

    let updateData = {};

    if (action === 'checkout') {
      if (iphone.status !== 'Available') {
        return NextResponse.json(
          { error: 'iPhone is not available for checkout' },
          { status: 400 }
        );
      }
      updateData = {
        status: 'Checked Out',
        owner: userId,
        checkOutDate: new Date()
      };
    } else if (action === 'checkin') {
      if (iphone.status !== 'Checked Out') {
        return NextResponse.json(
          { error: 'iPhone is not checked out' },
          { status: 400 }
        );
      }
      updateData = {
        status: 'Available',
        owner: null,
        checkOutDate: null
      };
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Update the iPhone
    const updatedIphone = await prisma.iphone.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedIphone);

  } catch (error) {
    console.error('Error in check in/out:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
