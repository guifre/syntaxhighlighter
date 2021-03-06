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
                "red": ["select","union","order", ">", "awk", "aspell", "cron", "gawk", "like", "pro", "rpm", "ssh", "similar", "snort", "top", "alias", "apt", "awk", "bzip2", "cat", "cd", "chmod", "chown", "cmp", "comm", "cp", "cpio", "date", "declare", "df", "echo", "enable", "env", "eval", "exec", "exit", "expect", "export", "find", "for", "free", "ftp", "gawk", "grep", "gzip", "ifconfig", "ifdown", "ifup", "kill", "less", "lft", "ln", "locate", "ls", "man", "mc", "mkdir", "more", "mv", "mysql", "neat", "netconfig", "netstat", "nslookup", "od", "passwd", "ping", "ps", "pwd", "read", "rm", "rsync", "screen", "sdiff", "sed", "shutdown", "slocate", "sort", "ssh", "su", "sudo", "tail", "tar", "top", "tr", "traceroute", "uname", "uniq", "unzip", "vi", "vim", "vmstat", "wc", "wget", "whatis", "whereis", "while", "whoami", "yum"],
                "blue": ["null","none","from", "true", "abstract", "and", "as", "assert", "auto", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "def", "default", "del", "delete", "do", "double", "elif", "else", "enum", "except", "export", "extends", "extern", "false", "final", "finally", "float", "for", "from", "function", "global", "goto", "if", "implements", "import", "in", "inline", "instanceof", "int", "interface", "is", "lambda", "let", "long", "native", "new", "nonlocal", "not", "null", "or", "package", "pass", "private", "protected", "public", "raise", "register", "restrict", "return", "short", "signed", "sizeof", "static", "strictfp", "struct", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typedef", "typeof", "union", "unsigned", "var", "void", "volatile", "while", "with", "yield"],
                "green": ["in", "by", "is", "up"]
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
                var code = "";
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
                                    code += token.node;
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

                            code += token.node;
                            switch (token.type)
                            {
                                case TOKEN_TYPE.STRING_DELIMITER:
                                    state = PARSER_STATE.CONSUMING_TOKENS;
                                    newInnerHtml += "<span class='green'>"  + code + "</span>";
                                    code = '';
                                    break;

                                default:
                                    break;
                            }
                    }
                }
                codeBlocks[blocksIndex].innerHTML = newInnerHtml + code;
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
                    if (token.node.toLowerCase() === this.highlightedKeywords[color][keyword])
                    {
                        return "<span class='" + color + "'>" + token.node + "</span>";
                    }
                }
            }
            if (token.node ===' ')
            {
                return '&nbsp;';
            }
            return token.node;
        }
    };
