"use client";

import { Booking } from "@prisma/client";

interface BookingListProps {
  booking: Booking;
}

const BookingList = ({ booking }: BookingListProps) => {
  return <div>empty</div>;
};

export default BookingList;
