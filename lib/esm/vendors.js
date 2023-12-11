export function vendorsToVendor(resp, vendorHash) {
    const v = resp.vendors.data?.[vendorHash];
    const c = resp.categories.data?.[vendorHash];
    const s = resp.sales.data?.[vendorHash].saleItems;
    const i = resp.itemComponents[vendorHash];
    const l = resp.currencyLookups.data;
    const sv = resp.stringVariables.data;
    return {
        vendor: { data: v, privacy: 2 },
        categories: { data: c, privacy: 2 },
        sales: { data: s, privacy: 2 },
        itemComponents: i,
        currencyLookups: { data: l, privacy: 2 },
        stringVariables: { data: sv, privacy: 2 },
    };
}
