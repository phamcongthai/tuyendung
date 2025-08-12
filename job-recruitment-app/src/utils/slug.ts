import slugify from 'slugify';
import { Model } from 'mongoose';
import { JobsDocument } from '../jobs/jobs.schema';

export async function generateUniqueSlug(
  model: Model<JobsDocument>,
  title: string,
  currentId?: string
): Promise<string> {
  let baseSlug = slugify(title, { lower: true, strict: true, locale: 'vi' });
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const exists = await model.findOne({
      slug,
      ...(currentId ? { _id: { $ne: currentId } } : {}),
    });
    if (!exists) break;
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
}
