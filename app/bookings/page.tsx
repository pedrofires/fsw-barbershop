import { getServerSession } from "next-auth";
import Header from "../_components/header";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import { db } from "../lib/prisma";
import BookingItem from "../_components/booking-item";
import { isFuture } from "date-fns/isFuture";
import { isPast } from "date-fns/isPast";

const BookingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const bookings = await db.booking.findMany({
    where: {
      userId: (session.user as any).id,
    },
    include: {
      service: true,
      barbershop: true,
    },
  });

  const confirmedBookings = bookings.filter((booking) =>
    isFuture(booking.date),
  );
  const finishedBookings = bookings.filter((booking) => isPast(booking.date));

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        <h2 className="mb-3 mt-6 text-sm font-bold uppercase text-gray-400">
          Confirmados
        </h2>

        <div className="flex flex-col gap-3">
          {confirmedBookings.map((booking) => (
            <BookingItem booking={booking} key={booking.id} />
          ))}
        </div>

        <h2 className="mb-3 mt-6 text-sm font-bold uppercase text-gray-400">
          Finalizados
        </h2>

        <div className="flex flex-col gap-3">
          {finishedBookings.map((booking) => (
            <BookingItem booking={booking} key={booking.id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default BookingsPage;
