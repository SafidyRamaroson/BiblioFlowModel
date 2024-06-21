import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // // Clear existing data
  // await prisma.membre.deleteMany({});
  // await prisma.livre.deleteMany({});
  // await prisma.preter.deleteMany({});
  // await prisma.preterLivre.deleteMany({});
  // await prisma.rendre.deleteMany({});
  // await prisma.renduLivre.deleteMany({});

  // Seed Membres
  const membres = [];
  for (let i = 0; i < 50; i++) {
    const membre = await prisma.membre.create({
      data: {
        nom: faker.person.fullName(),
        email: faker.internet.email(),
        sexe: faker.helpers.arrayElement(['MASCULIN', 'FEMININ']),
        age: faker.number.int({ min: 18, max: 60 }),
        contact: faker.phone.number(),
      },
    });
    membres.push(membre);
  }

  // Seed Livres
  const livres = [];
  for (let i = 0; i < 50; i++) {
    const livre = await prisma.livre.create({
      data: {
        designation: faker.commerce.productName(),
        exemplaire: faker.number.int({ min: 1, max: 10 }),
      },
    });
    livres.push(livre);
  }

  // Seed Preters and associated PreterLivres
  const preters = [];
  for (let i = 0; i < 50; i++) {
    const membre = membres[faker.number.int({ min: 0, max: membres.length - 1 })];
    const datePret = faker.date.past();
    const dateRetour = faker.date.soon({days:14,refDate:datePret})

    const preter = await prisma.preter.create({
      data: {
        datePret,
        dateRetour,
        idMembre: membre.id,
        preterLivres: {
          create: [
            {
              idLivre: livres[faker.number.int({ min: 0, max: livres.length - 1 })].id,
              quantity: faker.number.int({ min: 1, max: 3 }),
            },
          ],
        },
      },
    });
    preters.push(preter);
  }

  // Seed Rendre and associated RenduLivres
  for (let i = 0; i < 50; i++) {
    const preter = preters[faker.number.int({ min: 0, max: preters.length - 1 })];
    const dateRendu = faker.date.soon({days:24,refDate:preter.dateRetour}); //24: pour assimiler les retard

    await prisma.rendre.create({
      data: {
        dateRendu,
        idPret: preter.id,
        renduLivres: {
          create: [
            {
              idLivre: livres[faker.number.int({ min: 0, max: livres.length - 1 })].id,
              quantity: faker.number.int({ min: 1, max: 3 }),
            },
          ],
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Prisma seed done")
    await prisma.$disconnect();
  });
