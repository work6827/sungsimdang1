export type ProductPhoto={src:string;alt:string;caption:string;captionKo:string;position?:string};
// Key by product identity, never by the old shared illustration/category field.
export const productPhotos:Record<string,ProductPhoto>={
 soboro:{src:'products/soboro.webp',alt:'Deep-fried soboro bun photographed by Hyeon-Jeong Suk',caption:'Fried soboro · Hyeon-Jeong Suk · CC BY 2.0',captionKo:'튀김소보로 · Hyeon-Jeong Suk · CC BY 2.0'},
 chive:{src:'products/chive.webp',alt:'Representative savory herb and garlic bread on a plate, not the actual Pantalong product',caption:'Representative savory herb bread',captionKo:'짭짤한 허브빵 참고 이미지'},
 strawberry:{src:'strawberry-cake.webp',alt:'Representative strawberry cream cake, not actual Strawberry Siru Cake',caption:'Representative strawberry cake',captionKo:'딸기 케이크 참고 이미지',position:'center 57%'},
 'sweet-potato':{src:'products/sweet-potato.webp',alt:'Homemade sweet-potato bread rings; representative ingredient variation, not Sweet Potato Soboro',caption:'Representative sweet-potato bread',captionKo:'고구마빵 참고 이미지'},
 salt:{src:'bread-rolls.webp',alt:'Representative golden bread rolls; not the actual Salt Butter Bread',caption:'Representative bread rolls',captionKo:'롤빵 참고 이미지'},
 bome:{src:'products/bome.webp',alt:'Representative swirled layered pastry, not actual Bome Mountain bread',caption:'Representative layered pastry',captionKo:'겹겹이 쌓인 페이스트리 참고 이미지'},
 walnut:{src:'products/walnut.webp',alt:'Representative walnut loaf and nuts on a wooden board',caption:'Representative walnut loaf',captionKo:'호두 식빵 참고 이미지'},
 croissant:{src:'products/croissant.webp',alt:'Representative chocolate-filled croissant dusted with sugar',caption:'Representative chocolate croissant',captionKo:'초코 크루아상 참고 이미지'},
 mango:{src:'products/mango.webp',alt:'Representative mango cake with a yellow fruit topping',caption:'Representative mango cake',captionKo:'망고 케이크 참고 이미지'},
 bean:{src:'products/bean.webp',alt:'Red-bean-filled anpan cut open to show its filling; representative bun',caption:'Representative red-bean bun',captionKo:'단팥빵 참고 이미지'},
 milk:{src:'products/milk.webp',alt:'Representative sliced Swiss roll sponge cake, not the actual Pure Milk Roll',caption:'Representative Swiss roll',captionKo:'롤케이크 참고 이미지'},
 madeleine:{src:'products/madeleine.webp',alt:'Representative golden shell-shaped madeleines on a tray',caption:'Representative madeleines',captionKo:'마들렌 참고 이미지'},
};
