import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciar seed");
  await prisma.task.deleteMany();
  await prisma.team.deleteMany();

  const teamFront = await prisma.team.create({
    data: { name: 'Frontend', colorHex: '#61DAFB', description: 'Equipe de UI/UX e React' }
  });
  
  const teamBack = await prisma.team.create({
    data: { name: 'Backend', colorHex: '#339933', description: 'Equipe de Node.js e Banco de Dados' }
  });

  const teamMobile = await prisma.team.create({
    data: { name: 'Mobile', colorHex: '#000000', description: 'Equipe de React Native' }
  });

  await prisma.task.create({
    data: {
      title: 'Ajustar botão de login',
      description: 'O botão está torto na tela do iPhone.',
      status: 'Pendente',
      teams: { connect: [{ id: teamMobile.id }, { id: teamFront.id }] }
    }
  });

  await prisma.task.create({
    data: {
      title: 'Criar API de pagamentos',
      description: 'Integrar com a rota do Stripe.',
      status: 'Em Progresso',
      teams: { connect: [{ id: teamBack.id }] }
    }
  });

  await prisma.task.create({
    data: {
      title: 'Publicar App na loja',
      status: 'Concluída',
      teams: { connect: [{ id: teamMobile.id }] }
    }
  });
}

main()
.catch((e) => {
    console.error("❌ Erro ao rodar o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });