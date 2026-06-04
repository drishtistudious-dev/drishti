import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.staff.upsert({
    where: { email: 'admin@drishtistudios.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@drishtistudios.com',
      phone: '+1234567890',
      role: 'Admin',
      password: 'defaultpassword123', // Not used for OTP, but required by schema
    },
  })
  console.log('Seeded Admin Account:', admin)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
