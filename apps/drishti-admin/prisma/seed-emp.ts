import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create an employee
  const employee = await prisma.staff.upsert({
    where: { phone: '+1234567890' }, // Use the same phone so user can test
    update: {
      designation: 'Lead Cameraman',
      role: 'Staff'
    },
    create: {
      name: 'Rahul (Demo Emp)',
      email: 'rahul@drishtistudios.com',
      phone: '+1234567890',
      password: 'hashed_password_here',
      role: 'Staff',
      designation: 'Lead Cameraman'
    }
  });

  // Create an announcement
  await prisma.announcement.create({
    data: {
      title: 'New Drone Policies',
      content: 'Please ensure all drone batteries are charged at least 24 hours before any outdoor shoot.',
      authorId: employee.id // Assuming this employee is posting it for demo, or we can use the admin's ID
    }
  });

  // Get a booking
  const booking = await prisma.booking.findFirst();

  if (booking) {
    // Assign employee to booking
    await prisma.assignment.create({
      data: {
        bookingId: booking.id,
        staffId: employee.id,
        role: 'Primary Drone Operator'
      }
    });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
