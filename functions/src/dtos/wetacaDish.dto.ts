export type WetacaDishDto = {
    datePublished: string;
    id: number;
    name: string;
    slug: string;
    price: number;
    subscriptionPrice: number;
    category: {
        _id: string;
        id: string;
        name: string;
        slug: string;
        description: string;
        order: number;
        subscriptionPrice: number;
        __typename: string;
    };
    tags: string[];
    ingredients: string[];
    ingredientsBreakdown: string[];
    allergens: string[];
    isNew: boolean;
    features: string;
    specialTemplate: string;
    rating: {
        averageRating: number;
        reviewCount: number;
        __typename: string;
    };
    isPromoted: boolean;
    frontPage: boolean;
    weight: number;
    nutritionFacts: {
        energy: number;
        totalFat: number;
        saturatedFat: number;
        proteins: number;
        hydrates: number;
        sugars: number;
        fiber: number;
        salt: number;
        __typename: string;
    };
    __typename: string;
};
