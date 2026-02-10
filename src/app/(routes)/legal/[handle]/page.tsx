type Props = {
    params: { handle: string };
};

export default function LegalPage({ params }: Props) {
    return (
        <main>
            <h1>Legal: {params.handle}</h1>
        </main>
    );
}