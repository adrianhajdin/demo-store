import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { Layout } from '@components/common'
import { BuilderComponent, Builder, builder } from '@builder.io/react'
import builderConfig from '@config/builder'
import DefaultErrorPage from 'next/error'
import Head from 'next/head'
import { resolveBuilderContent } from '@lib/resolve-builder-content'

builder.init(builderConfig.apiKey)
import '../sections/ProductGrid/ProductGrid.builder'
import '../sections/CollectionView/CollectionView.builder'
import '../sections/Hero/Hero.builder'

const isProduction = process.env.NODE_ENV === 'production'

export async function getStaticProps({
  params,
  locale,
}: GetStaticPropsContext<{ path: string[] }>) {
  const page = await resolveBuilderContent('page', {
    locale,
    urlPath: '/' + (params?.path?.join('/') || ''),
  })
  return {
    props: {
      page,
      locale,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 4 minutes ( 240 seconds)
    revalidate: 240,
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const pages = await builder.getAll('page', {
    options: { noTargeting: true },
    apiKey: builderConfig.apiKey,
  })

  return {
    paths: pages.map((page) => `${page.data?.url}`),
    fallback: true,
  }
}

export default function Path({
  page,
  locale,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  if (router.isFallback) {
    return <h1>Loading...</h1>
  }
  // This includes setting the noindex header because static files always return a status 200 but the rendered not found page page should obviously not be indexed
  if (!page && !Builder.isEditing && !Builder.isPreviewing) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
          <meta name="title"></meta>
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    )
  }

  const { title, description, image } = page?.data! || {}

  return (
    <div>
      {title && (
        <NextSeo
          title={title}
          description={description}
          openGraph={{
            type: 'website',
            title,
            description,
            locale,
            ...(image && {
              images: [
                {
                  url: image,
                  width: 800,
                  height: 600,
                  alt: title,
                },
              ],
            }),
          }}
        />
      )}
      <BuilderComponent
        options={{ includeRefs: true } as any}
        model="page"
        {...(page && { content: page })}
      />
    </div>
  )
}

Path.Layout = Layout
