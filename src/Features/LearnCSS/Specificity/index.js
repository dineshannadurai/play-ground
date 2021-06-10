import "./index.css";

export const template = `
    <div class="specificity">
        <h1>Specificity</h1>
        <ul>
            <li>
                Universal selector 
                <span>0points</span>
            </li>
            <li>
                Element or pseudo-element selector
                <span>1points</span>
            </li>
            <li>
                Class, pseudo-class, or attribute selector
                <span>10points</span>
                <h2>Exceptionals</h2>
                <ul>
                    <li>:is()</li>
                    <li>:not()</li>
                    <li>:where()</li>
                </ul>
            </li>
            <li>
                ID selector
                <span>100points</span>
            </li>
            <li>
                Inline style attribute
                <span>1000points</span>
            </li>
            <li>
                !important rule
                <span>10000points</span>
            </li>
        </ul>
    </div>
`;

export const initialize = () => {
    document.title = "Specificity : Learn CSS";
};
