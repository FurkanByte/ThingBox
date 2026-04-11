const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const prisma = new PrismaClient()

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const ask = (q) => new Promise((res) => rl.question(q, res))

  console.log('\n=== ThingBox Admin Sifre Sifirlama ===\n')

  const admins = await prisma.user.findMany({ where: { isAdmin: true } })

  if (admins.length === 0) {
    console.log('Hic admin kullanici yok, yeni admin olusturuluyor...')
    const newPassword = await ask('Yeni sifre: ')
    const hash = await bcrypt.hash(newPassword, 10)
    await prisma.user.create({
      data: {
        username: 'admin',
        passwordHash: hash,
        isAdmin: true,
        canViewInventory: true,
        canManageSystem: true,
        canAddStock: true,
        canDrawToProject: true,
        canConsume: true,
      }
    })
    console.log('\nAdmin olusturuldu! Kullanici: admin, Sifre: ' + newPassword)
  } else {
    console.log('Admin kullanicilar:')
    admins.forEach((a, i) => console.log(`  ${i + 1}. ${a.username}`))
    const newPassword = await ask('\nYeni sifre (tum adminlere uygulanir): ')
    const hash = await bcrypt.hash(newPassword, 10)
    for (const admin of admins) {
      await prisma.user.update({ where: { id: admin.id }, data: { passwordHash: hash } })
      console.log('  Guncellendi: ' + admin.username)
    }
    console.log('\nSifre sifirlandi! Artik yeni sifrenizle giris yapabilirsiniz.')
  }

  rl.close()
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
