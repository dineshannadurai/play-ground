import "./index.css";

export const template = `
    <div class="top">
        <p data-para-number="1" >paragraph one</p>
        <p id="middle-para-id" class="middle-para extra-class" data-para-number="2">paragraph two</p>
        <p class="last-para" data-para-number="3">paragraph three</p>
        <div>
            <span id="span-one">span1</span>
            <span id="span-two">
                span2
                <span>inner span</span>
            </span>
        </div>
        <div>
            <ul>
                <li>list one</li>
                <li>list two</li>
            </ul>
        </div>
        <div>
          <p>1 level deep</p>
          <div>
            <p>2 levels deep</p>
            <div>
              <p>3 levels deep</p>
            </div>
          </div>
        </div>
    </div>
`;

export const initialize = () => {
    document.title = "Selectors : Learn CSS";
};
