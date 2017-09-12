var TOKEN_TYPE = {
    OPEN_BRACKET: "open bracket",
    STRING_DELIMITER: "string delimiter",
    WHITE_SPACE: "white space",
    OTHER: "other"
};

var PARSER_STATE = {
    CONSUMING_TOKENS: {},
    CONSUMING_STRING: {}
};

var Token = class Token {
    constructor(node, type)
    {
        this.node = node;
        this.type = type;
    }
};

var Highlighter = class Highlighter {
        constructor()
        {
            this.highlightedKeywords = {
                "red": ["$", ">"],
                "blue": ["None", "True", "abstract", "and", "as", "assert", "auto", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "def", "default", "del", "delete", "do", "double", "elif", "else", "enum", "except", "export", "extends", "extern", "false", "final", "finally", "float", "for", "from", "function", "global", "goto", "if", "implements", "import", "in", "inline", "instanceof", "int", "interface", "is", "lambda", "let", "long", "native", "new", "nonlocal", "not", "null", "or", "package", "pass", "private", "protected", "public", "raise", "register", "restrict", "return", "short", "signed", "sizeof", "static", "strictfp", "struct", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typedef", "typeof", "union", "unsigned", "var", "void", "volatile", "while", "with", "yield"],
                "green": ["in", "is", "up"]
            };

            this.regexes = [
                "[a-z0-9]+://[a-zA-Z0-9-./]+[^\\s]*",
                "\\d+\\.\\d+\\.\\d+\\.\\d+:\\d+",
                "\\d+\\.\\d+\\.\\d+\\.\\d+"
            ];
        }

        run(document)
        {
            var codeBlocks = document.getElementsByTagName("code");
            for (var blocksIndex in codeBlocks)
            {
                var html = codeBlocks[blocksIndex].innerHTML;
                if (html === undefined)
                {
                    continue;
                }
                var tokens = this.tokenize(html);

                var newInnerHtml = "";
                var state = PARSER_STATE.CONSUMING_TOKENS;
                for (var i = 0; i < tokens.length; i++)
                {
                    var token = tokens[i];
                    switch (state)
                    {
                        case PARSER_STATE.CONSUMING_TOKENS:

                            switch (token.type)
                            {
                                case TOKEN_TYPE.STRING_DELIMITER:
                                    state = PARSER_STATE.CONSUMING_STRING;
                                    newInnerHtml += "<span class='green'>" + this.highlight(token);
                                    break;

                                case TOKEN_TYPE.OTHER:
                                    if (this.nextTokenIsOpenBracket(i, tokens))
                                    {
                                        newInnerHtml += "<span class='green'>" + token.node + "</span>";
                                    }
                                    else
                                    {
                                        newInnerHtml += this.highlight(token);
                                    }
                                    break;

                                default:
                                    newInnerHtml += this.highlight(token);
                                    break;
                            }
                            break;


                        case PARSER_STATE.CONSUMING_STRING:
                            switch (token.type)
                            {
                                case TOKEN_TYPE.STRING_DELIMITER:
                                    state = PARSER_STATE.CONSUMING_TOKENS;
                                    newInnerHtml += token.node + "</span>";
                                    break;

                                default:
                                    newInnerHtml += token.node;
                                    break;
                            }
                    }
                }
                codeBlocks[blocksIndex].innerHTML = newInnerHtml;
            }

        }

        tokenize(html)
        {
            var currentWord = "";
            var tokens = [];
            for (var character in html)
            {
                var currentChar = html[character];
                switch (currentChar)
                {
                    case "(":
                        this.consume(currentWord, tokens);
                        currentWord = "";
                        tokens.push(new Token(currentChar, TOKEN_TYPE.OPEN_BRACKET));
                        break;

                    case " ":
                        this.consume(currentWord, tokens);
                        currentWord = "";
                        tokens.push(new Token(currentChar, TOKEN_TYPE.WHITE_SPACE));
                        break;

                    case '"':
                    case "'":
                        this.consume(currentWord, tokens);
                        currentWord = "";
                        tokens.push(new Token(currentChar, TOKEN_TYPE.STRING_DELIMITER));
                        break;

                    default:
                        currentWord += currentChar;
                        break;
                }
            }

            this.consume(currentWord, tokens);
            currentWord = "";
            return tokens;
        }

    consume(currentWord, tokens)
    {
        if (currentWord.length > 0)
        {
            tokens.push(new Token(currentWord, TOKEN_TYPE.OTHER));
        }
    }

    nextTokenIsOpenBracket(i, tokens)
    {
        return i + 1 < tokens.length && tokens[i + 1].type === TOKEN_TYPE.OPEN_BRACKET;
    }

    highlight(token)
    {
        for (var regex in this.regexes)
        {
            if (token.node.match(this.regexes[regex]))
            {
                return "<span class='blue'>" + token.node + "</span>";
            }
        }
        for (var color in this.highlightedKeywords)
            {
                for (var keyword in this.highlightedKeywords[color])
                {
                    if (token.node === this.highlightedKeywords[color][keyword])
                    {
                        return "<span class='" + color + "'>" + token.node + "</span>";
                    }
                }
            }
            return token.node;
        }
    }
;
