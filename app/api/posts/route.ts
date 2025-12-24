import { getPosts } from '@/features/post/actions'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tagIds = searchParams.getAll('tagIds') || null
  const categoryIds = searchParams.getAll('categoryIds') || null
  const perPage = Number(searchParams.get('perPage') ?? 6)
  const page = Number(searchParams.get('page') ?? 1)

  const filters: {
    tags?: string[]
    categories?: string[]
  } = {}

  if (tagIds.length) filters.tags = tagIds
  if (categoryIds.length) filters.categories = categoryIds

  const result = await getPosts({
    filters,
    pagination: { page, perPage },
  })

  return Response.json(result.data)
}
