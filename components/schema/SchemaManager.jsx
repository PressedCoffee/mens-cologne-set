import ProductSchema from "./ProductSchema";
import WebsiteSchema from "./WebsiteSchema";
import OrganizationSchema from "./OrganizationSchema";
import ProductCollectionSchema from "./ProductCollectionSchema";

export default function SchemaManager({ type, data }) {
  return (
    <>
      {/* Base schemas that appear on every page */}
      <WebsiteSchema />
      <OrganizationSchema />

      {/* Conditional schemas based on page type */}
      {type === "product" && data && <ProductSchema product={data} />}
      {type === "collection" && data && (
        <ProductCollectionSchema products={data} pageType={type} />
      )}
    </>
  );
}
