import { useEffect, MouseEvent } from 'react';
import { LESSON_CONTENT } from '@/lib/curso-content';

interface Props {
    aulaSlug: string;
    descricao: string;
}

export default function ConteudoAula({ aulaSlug, descricao }: Props) {
    useEffect(() => {
        document.querySelectorAll('.check-item').forEach(el => {
            el.removeAttribute('onclick');
        });
    }, [aulaSlug]);

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const checkItem = target.closest('.check-item');
        if (checkItem) {
            checkItem.classList.toggle('checked');
        }
    };

    return (
        <div>
            <p style={{ color: '#607d8b', fontSize: 13, marginTop: 0 }}>
                {descricao}
            </p>
            {LESSON_CONTENT[aulaSlug] ? (
                <div
                    className="lesson-html-content"
                    onClick={handleClick}
                    dangerouslySetInnerHTML={{ __html: LESSON_CONTENT[aulaSlug] }}
                    style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.6, marginTop: 24 }}
                />
            ) : (
                <div style={{ padding: '20px', background: '#0d1729', borderRadius: 10, border: '1px solid #1e3a5f', color: '#94a3b8', fontSize: 13 }}>
                    Material de apoio completo disponível no PDF do curso.
                </div>
            )}
        </div>
    );
}
