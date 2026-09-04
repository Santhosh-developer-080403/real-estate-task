export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        title: "Property Details | Your Property Website",
        description: "View property details and information.",
      };
    }

    const property = await response.json();

    return {
      title: `${property.title} | Your Property Website`,
      description:
        property.description ||
        `View details of ${property.title} in ${property.city}.`,
      openGraph: {
        title: `${property.title} | Your Property Website`,
        description:
          property.description ||
          `View details of ${property.title} in ${property.city}.`,
        images: property.images ? [property.images[0]] : [],
      },
    };
  } catch (error) {
    return {
      title: "Property Details | Your Property Website",
      description: "View property details and information.",
    };
  }
}

export default function PropertyDetailsLayout({ children }) {
  return children;
}
