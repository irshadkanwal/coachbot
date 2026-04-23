import { PrismaClient } from '@prisma/client';
import { categories } from './categories';
import { blogPosts } from './blogPosts';
import { Area } from '@models/data.models';
import { withoutTrailingSlash } from '../src/utils/formatter';

const prisma = new PrismaClient();

const updateHistoryAreas = async (categoryChanges: Record<string, string>) => {
  const start = Date.now();
  try {
    await prisma.$transaction(async (prisma) => {
      const historyItems = await prisma.lifeInsightsHistory.findMany();

      await Promise.all(historyItems.map(async (item) => {
        let areas: Area[] = JSON.parse(item.areas as string);
        const updatedAreas = areas.map((area) => ({
          ...area,
          id: area.id && categoryChanges[area.id] || categoryChanges[area.name] || area.id,
        }));

        if (JSON.stringify(areas) !== JSON.stringify(updatedAreas)) {
          await prisma.lifeInsightsHistory.update({
            where: { id: item.id },
            data: { areas: JSON.stringify(updatedAreas) },
          });
        }
      }));

      console.log("Updated life insight history areas data");
    });
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to update areas in LifeInsightsHistory");
  }
};


const seedCategories = async () => {
  try {
    const categoryChanges: Record<string, string> = {};

    for (const { id, name, instruction, subcategories, translateKey, tooltipKey } of categories) {
      const oldCategory = await prisma.category.findFirst({
        where: {
          OR: [
            { id: id },
            { name: name }
          ]
        }
      });

      if (oldCategory) {
        if (oldCategory.id !== id) {
          categoryChanges[oldCategory.id] = id
        }
        if (oldCategory.name !== name) {
          categoryChanges[oldCategory.name] = id;
        }

        await prisma.category.update({
          where: { id: oldCategory.id },
          data: {
            id,
            name: oldCategory.name === name ? undefined : name,
            instruction,
            translateKey,
            tooltipKey,
            subcategories: {
              deleteMany: {},
              create: subcategories.map((subcategory) => ({
                id: subcategory.id,
                name: subcategory.name,
                instruction: subcategory.instruction,
                image: subcategory.image,
                translateKey: subcategory.translateKey,
              })),
            },
          },
        });
      } else {
        await prisma.category.create({
          data: {
            id,
            name,
            instruction,
            translateKey,
            tooltipKey,
            subcategories: {
              create: subcategories.map((subcategory) => ({
                id: subcategory.id,
                name: subcategory.name,
                instruction: subcategory.instruction,
                image: subcategory.image,
                translateKey: subcategory.translateKey,
              })),
            },
          },
        });
      }
    }

    console.log('Seeded categories data');
    return categoryChanges;
  } catch (e) {
    console.error(e);
    throw new Error(`Error during seed categories`);
  }
};


const seedPosts = async () => {
  try {
    await prisma.post.deleteMany();

    for (const post of blogPosts) {
      await prisma.post.create({
        data: {
          ...post,
          categoryName: post.categoryName || undefined,
          author: post.author || 'Coachbot AI',
        },
      });
    }

    console.log('Seeded posts data');
  } catch (e) {
    console.error(e);
    throw new Error(`Error during seed posts`);
  }
};


const getAssistantsData = async (userIds: string[]) => {
  const ids = !process.env.DEFAULT_ASSISTANT_ID || userIds.includes(process.env.DEFAULT_ASSISTANT_ID)
    ? userIds
    : [...userIds, process.env.DEFAULT_ASSISTANT_ID];

  const response = await fetch(
    `${withoutTrailingSlash(process.env.STUDIO_API_BASE_URL)}/api/assistant`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ids),
    }
  );

  const { assistants } = await response.json();

  return assistants;
};

const upserAssistantsWithConfig = async (assistants: any[]) => {
  for (const assistantData of assistants) {
    const { id, authorData, userId, configuration, meta, ...assistantFields } = assistantData;
    const isDefault = id === process.env.DEFAULT_ASSISTANT_ID;

    await prisma.assistant.upsert({
      where: { id },
      update: { ...assistantFields, isDefault, authorData, meta },
      create: { ...assistantFields, id, isDefault, authorData, meta },
    });

    await prisma.assistantConfiguration.upsert({
      where: { assistantId: id },
      update: {
        ...configuration,
        tokensLimit: configuration.tokensLimit || 30000,
        tokenLimitPeriod: isDefault ? 'daily' : 'monthly'
      },
      create: {
        ...configuration,
        assistantId: id,
        tokensLimit: configuration.tokensLimit || 30000,
        tokenLimitPeriod: isDefault ? 'daily' : 'monthly'
      },
    });

    console.info(`Upserted assistant: ${assistantFields.name}`);
  }
}

const seedAssistants = async () => {
  try {
    const users = await prisma.user.findMany({ include: { assistants: true } });
    const allAssistantIds = [...new Set(users.flatMap(user => user.assistants.map(assistant => assistant.id)))];

    if (!allAssistantIds.length) {
      console.warn('No assistant IDs found among users.');
      return;
    }

    const assistants = await getAssistantsData(allAssistantIds);

    if (!assistants || !assistants.length) {
      console.warn('No assistants found from remote data.');
      return;
    }

    await upserAssistantsWithConfig(assistants);

    for (const user of users) {
      const connect = user.assistantsIds.filter(id => assistants.some((a: any) => a.id === id)).map((id) => ({ id }));

      await prisma.user.update({
        where: { id: user.id },
        data: { assistants: { connect } },
      });

      console.info(`Connected ${user.assistantsIds.length} assistants to user ${user.id}`);
    }

    console.log('Seeded users assitants data');
  } catch (e) {
    console.error(e);
    throw new Error(`Error during seed assistants`);
  }
};

const load = async () => {
  try {
    // const categoryChanges = await seedCategories();
    // await updateHistoryAreas(categoryChanges);
    await seedPosts();
    await seedAssistants();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
