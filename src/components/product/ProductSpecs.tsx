interface ProductSpecsProps {
    specifications: {
        label: string;
        value: string | number | null | undefined;
    }[];
}

export default function ProductSpecs({ specifications }: ProductSpecsProps) {
    if (!specifications || specifications.length === 0) return null;

    return (
        <div className="mt-8 border-t border-stone-100 pt-8">
            <h3 className="font-serif text-lg font-semibold text-stone-900 mb-6">Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-stone-50">
                        <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">{spec.label}</span>
                        <span className="text-sm font-medium text-stone-900">{spec.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
