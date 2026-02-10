type Props = {
    params: { query: string };
};

export default function SearchResultsPage({ params }: Props) {
    return (
        <main>
            <h1>Results for {decodeURIComponent(params.query)}</h1>
        </main>
    );
}