import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.staff.upsert({
    where: { phone: '+918792019057' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin2@drishtistudios.com',
      phone: '+918792019057',
      role: 'Admin',
      password: 'defaultpassword123', // Not used for OTP
    },
  })
  console.log('Added Admin Account:', admin)
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
