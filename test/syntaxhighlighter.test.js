var expect = require('chai').expect;
var jsdom = require('jsdom');
const {JSDOM} = jsdom;
var fs = require('fs');
var vm = require('vm');
var path = './syntaxhighlighter.js';

var code = fs.readFileSync(path);
vm.runInThisContext(code);

describe('whenNoCodeBlocks_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body>alpha</body>'
    ).thenExpectedCodeBuilt(
        'alpha'
    );
});

describe('whenEmptyCodeBlock_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code></code></body>'
    ).thenExpectedCodeBuilt(
        '<code></code>'
    );
});

describe('whenCodeBlockWithOneKeyword_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>alpha</code></body>'
    ).thenExpectedCodeBuilt(
        '<code>alpha</code>'
    );
});

describe('whenCodeBlockWithOneKeywordAndNewLine_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>alpha\nbravo</code></body>'
    ).thenExpectedCodeBuilt(
        '<code>alpha\nbravo</code>'
    );
});

describe('whenCodeBlockWithInterestingKeyword_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>in</code></body>'
    ).thenExpectedCodeBuilt(
        '<code><span class="blue">in</span></code>'
    );
});

describe('whenCodeBlockWithInterestingKeywordAndExtraWords_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>alpha in bravo</code></body>'
    ).thenExpectedCodeBuilt(
        '<code>alpha <span class="blue">in</span> bravo</code>'
    );
});

describe('whenHighlightedWordIsFirstWord_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>in alpha</code></body>'
    ).thenExpectedCodeBuilt(
        '<code><span class="blue">in</span> alpha</code>'
    );
});

describe('whenHighlightedWordIsLastToken_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>alpha in</code></body>'
    ).thenExpectedCodeBuilt(
        '<code>alpha <span class="blue">in</span></code>'
    );
});

describe('whenCodeHasSingleQuotedString_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>\'alpha\'</code></body>'
    ).thenExpectedCodeBuilt(
        '<code><span class="green">\'alpha\'</span></code>'
    );
});

describe('whenCodeHasSingleQuotedStringWithMultipleTokens_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>\'alpha bravo\'</code></body>'
    ).thenExpectedCodeBuilt(
        '<code><span class="green">\'alpha bravo\'</span></code>'
    );
});

describe('whenCodeHasInterestingTokenInString_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>\'alpha in\'</code></body>'
    ).thenExpectedCodeBuilt(
        '<code><span class="green">\'alpha in\'</span></code>'
    );
});

describe('whenCodeHasInterestingTokenInStringAndTrailingSpace_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>\'alpha in \'</code></body>'
    ).thenExpectedCodeBuilt(
        '<code><span class="green">\'alpha in \'</span></code>'
    );
});

describe('whenCodeHasDoubleQuotedStringWithMultipleTokens_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>"alpha in "</code></body>'
    ).thenExpectedCodeBuilt(
        '<code><span class="green">"alpha in "</span></code>'
    );
});

describe('whenMethodInvocation_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>alpha()</code></body>'
    ).thenExpectedCodeBuilt(
        '<code><span class="green">alpha</span>()</code>'
    );
});


describe('whenMethodInvocationQuoted_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>"alpha()"</code></body>'
    ).thenExpectedCodeBuilt(
        '<code><span class="green">"alpha()"</span></code>'
    );
});

describe('whenConditionalStatement_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>    if (modified != 0) {\n</code></body>'
    ).thenExpectedCodeBuilt(
        '<code>    <span class="blue">if</span> (modified != 0) {\n</code>'
    );
});

describe('whenMultipleCodeBlocks_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>alpha</code><code>bravo</code></body>'
    ).thenExpectedCodeBuilt(
        '<code>alpha</code><code>bravo</code>'
    );
});

describe('whenMultupleCodeBlocks_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>alpha</code><code>bravo</code></body>'
    ).thenExpectedCodeBuilt(
        '<code>alpha</code><code>bravo</code>'
    );
});

describe('whenCodeHasUrl_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>http://alpha.com/bravo</code></body>'
    ).thenExpectedCodeBuilt(
        '<code><span class="blue">http://alpha.com/bravo</span></code>'
    );
});

describe('whenCodeHasIp_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>10.10.10.10</code></body>'
    ).thenExpectedCodeBuilt(
        '<code><span class="blue">10.10.10.10</span></code>'
    );
});

describe('whenCodeHasIp_thenExpectedCodeGenerated', function () {
    new whenCodeHighlighted(
        '<body><code>10.10.10.10:8080</code></body>'
    ).thenExpectedCodeBuilt(
        '<code><span class="blue">10.10.10.10:8080</span></code>'
    );
});

function whenCodeHighlighted(code)
{
    const {document} = (new JSDOM(code)).window;
    this.thenExpectedCodeBuilt = function (expected) {
        new Highlighter().run(document);
        expect(document.body.innerHTML).eql(expected);
    };
}