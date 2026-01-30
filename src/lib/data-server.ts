
'use server';

import { adminDb } from '@/firebase/server';
import type { Product, ProductData, ServiceData, NewsArticleData, BrandData, PricelistData, PricelistFile, SiteSettings } from '@/lib/types';
import { notFound } from 'next/navigation';

// Helper to process snapshots
function processSnapshot<T>(snapshot: FirebaseFirestore.QuerySnapshot): (T & { id: string })[];
function processSnapshot<T>(snapshot: FirebaseFirestore.DocumentSnapshot): (T & { id: string }) | null;
function processSnapshot<T>(snapshot: FirebaseFirestore.QuerySnapshot | FirebaseFirestore.DocumentSnapshot): (T & { id: string })[] | (T & { id: string }) | null {
    if ('docs' in snapshot) { // QuerySnapshot
        if (snapshot.empty) return [];
        return snapshot.docs.map(doc => ({ ...doc.data() as T, id: doc.id }));
    }
    // DocumentSnapshot
    if (snapshot.exists) {
        return { ...snapshot.data() as T, id: snapshot.id };
    }
    return null;
}

type GetProductsOptions = {
    limit?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
};
export async function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
    let query: FirebaseFirestore.Query = adminDb.collection('products').where('discontinued', '!=', true);
    if (options.orderBy) {
        query = query.orderBy(options.orderBy, options.orderDirection);
    }
    if (options.limit) {
        query = query.limit(options.limit);
    }
    const snapshot = await query.get();
    return processSnapshot<ProductData>(snapshot);
}

export async function getProductById(id: string): Promise<Product> {
    const snapshot = await adminDb.collection('products').doc(id).get();
    const product = processSnapshot<ProductData>(snapshot);
    if (!product || product.discontinued) {
        notFound();
    }
    return product;
}

type GetServicesOptions = {
    limit?: number;
};
export async function getServices(options: GetServicesOptions = {}) {
    let query: FirebaseFirestore.Query = adminDb.collection('services');
    if (options.limit) {
        query = query.limit(options.limit);
    }
    const snapshot = await query.get();
    return processSnapshot<ServiceData>(snapshot);
}

export async function getServiceById(id: string) {
    const snapshot = await adminDb.collection('services').doc(id).get();
    const service = processSnapshot<ServiceData>(snapshot);
     if (!service) {
        notFound();
    }
    return service;
}


type GetNewsOptions = {
    limit?: number;
};
export async function getNews(options: GetNewsOptions = {}) {
    let query: FirebaseFirestore.Query = adminDb.collection('news').orderBy('date', 'desc');
     if (options.limit) {
        query = query.limit(options.limit);
    }
    const snapshot = await query.get();
    return processSnapshot<NewsArticleData>(snapshot);
}

export async function getNewsArticleById(id: string) {
    const snapshot = await adminDb.collection('news').doc(id).get();
    const article = processSnapshot<NewsArticleData>(snapshot);
    if (!article) {
        notFound();
    }
    return article;
}

export async function getSiteSettings() {
    const snapshot = await adminDb.doc('admin/dashboard/settings/tmluzon').get();
    return processSnapshot<SiteSettings>(snapshot);
}

export async function getBrands() {
    const snapshot = await adminDb.collection('brands').orderBy('sortOrder').get();
    return processSnapshot<BrandData>(snapshot);
}

export async function getPricelists() {
    const snapshot = await adminDb.collection('pricelists').get();
    const pricelists = processSnapshot<PricelistData>(snapshot) as PricelistFile[];

    // Group by brand
    const groups: { brand: string; files: PricelistFile[] }[] = [];
    pricelists.forEach((file) => {
      let group = groups.find((g) => g.brand === file.brand);
      if (!group) {
        group = { brand: file.brand, files: [] };
        groups.push(group);
      }
      group.files.push(file);
    });
    return groups.sort((a,b) => a.brand.localeCompare(b.brand));
}
