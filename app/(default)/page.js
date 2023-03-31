import Editor from '../components/Editor';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export default function Home() {
    return (
        <div className="mx-auto max-w-[720px] bg-white">
            <Editor />
            <InlineMath math="\int_0^\infty x^2 dx" />
        </div>
    );
}
