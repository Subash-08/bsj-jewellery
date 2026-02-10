export interface Metafield {
    id: string;
    namespace: string;
    key: string;
    value: string | number | boolean;
    type: string;
}

// Jewelry-specific metafield interface
export interface JewelryMetafields {
    // Stone & Weight Details
    'Stone Weight'?: number;
    'Net Weight'?: number;
    'Gross Weight'?: number;

    // Certification & Quality
    'Certification Available'?: boolean;
    'Certification Authority'?: string;
    'Purity Percentage'?: string;
    'Purity'?: string;
    'Metal Type'?: string;
    'Metal Color'?: string;
    'Country of Origin'?: string;
    'Hallmark Type'?: string;
    'Finish Type'?: string;

    // Product Classification
    'Product Type'?: string;
    'Jewellery Category'?: string;
    'Sub Category'?: string;
    'Gender'?: string;
    'Occasion'?: string;
    'Collection Name'?: string;
    'Design Style'?: string;
    'SKU Code'?: string;

    // Inventory & Pricing
    'Wholesale Price'?: number;
    'Purchase Cost'?: number;
    'Margin Percentage'?: number;
    'MOQ for B2B'?: number;
    'B2B Enable'?: boolean;
    'Reorder Level'?: number;

    // Media & Display
    'Zoom Priority Image'?: boolean;
    '360 view available'?: boolean;
    'Model Shot Available'?: boolean;
    'video Available'?: boolean;
    'Highlight Badge'?: string;
    'Display Price Breakup'?: boolean;

    // Policies & Services
    'Buy Back Availble'?: boolean;
    'Exchange Available'?: boolean;
    'Return Eligible'?: boolean;
    'Customization Available'?: boolean;
    'Dispatch Time'?: string;
    'Ready Stock'?: boolean;

    // Care & Wearability
    'Care Instructions'?: string;
    'Cleaning Method'?: string;
    'Allergy Safe'?: boolean;
    'Skin Friendly'?: boolean;
    'Suitable for daily wear'?: boolean;
    'Light Weight Category'?: boolean;
    'Adjustable Fit'?: boolean;

    // Jewelry Type Specific
    'Earring Type'?: string;
    'Closure Type'?: string;
    'Necklace Type'?: string;
    'Necklace Length'?: string;
    'Pendant Included'?: boolean;
    'Chain Pattern'?: string;
    'Chain Thickness(mm)'?: number;
    'Chain Length(inches)'?: number;
    'Lock Type'?: string;
    'Adjustable chain Available'?: boolean;
    'Bracelet Length(inches)'?: number;
    'Bangle Type'?: string;
    'Inner Diametre'?: string;
    'Bangle Size'?: string;
    'Adjustable Length'?: boolean;
    'Ankle Length'?: string;
    'Toe Ring Size'?: string;

    // Stone Details
    'Stone Type'?: string;
    'Stone Shape'?: string;
    'Stone Count'?: number;
    'Stone Color'?: string;
    'Stone Quality Grade'?: string;
    'Stone Setting Type'?: string;

    // Indian Pricing Breakdown
    'Price Breakup Enabled'?: boolean;
    'GST Percentage'?: string;
    'GST Amount'?: number;
    'Metal Rate'?: number;
    'Final Metal Value'?: number;
    'Making Charge Value'?: number;
    'Making Charge Type'?: string;
    'Wastage Weight'?: number;
    'Wastage Percentage'?: number;

    // Vendor Information
    'Vendor Name'?: string;
    'Vendor Code'?: string;

    // Internal
    'Internal Notes'?: string;
}
