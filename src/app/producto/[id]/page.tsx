import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { curatedProducts } from "@/data/curated-products";
import { ProductDetail } from "@/components/products/ProductDetail";
import { ProductGrid } from "@/components/products/ProductGrid";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = curatedProducts.find((p) => p.id === id);
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: product.title,
    description: product.description || `Comprá ${product.title} al mejor precio en MercadoLibre Argentina.`,
    openGraph: {
      title: product.title,
      description: product.description || `Comprá ${product.title} al mejor precio.`,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = curatedProducts.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const related = curatedProducts
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const otherCategories = curatedProducts
    .filter((p) => p.categorySlug !== product.categorySlug)
    .slice(0, 4);

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-10">
      <ProductDetail product={product} />

      {related.length > 0 && (
        <ProductGrid
          products={related}
          title="Productos similares"
          subtitle={`Más productos de ${product.category}`}
        />
      )}

      {otherCategories.length > 0 && (
        <ProductGrid
          products={otherCategories}
          title="Popular en otras categorías"
        />
      )}
    </div>
  );
}
