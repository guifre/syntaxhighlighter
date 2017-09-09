var Highlighter = class Highlighter {
    constructor()
    {
        this.highlightedKeywords = {
            'red': ['$', '>'],
            'blue': [' alse', 'None', 'True', 'abstract', 'and', 'as', 'assert', 'auto', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'debugger', 'def', 'default', 'del', 'delete', 'do', 'double', 'elif', 'else', 'enum', 'except', 'export', 'extends', 'extern', 'false', 'final', 'finally', 'float', 'for', 'from', 'function', 'global', 'goto', 'if', 'implements', 'import', 'in', 'inline', 'instanceof', 'int', 'interface', 'is', 'lambda', 'let', 'long', 'native', 'new', 'nonlocal', 'not', 'null', 'or', 'package', 'pass', 'private', 'protected', 'public', 'raise', 'register', 'restrict', 'return', 'short', 'signed', 'sizeof', 'static', 'strictfp', 'struct', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'typedef', 'typeof', 'union', 'unsigned', 'var', 'void', 'volatile', 'while', 'with', 'yield'],
            'green': ['in', 'is', 'up']
        };
    }

    run(document)
    {
        var codeBlocks = document.getElementsByTagName('code');
        for (var blocksIndex in codeBlocks)
        {
            var newInnerHtml = '';
            var html = codeBlocks[blocksIndex].innerHTML;
            if (html === undefined)
            {
                continue;
            }
            var currentWord = '';
            var state = 'text';
            for (var character in html)
            {
                var currentChar = html[character];
                switch (currentChar)
                {
                    case '(':
                        if (currentWord.length > 1 && state === 'text')
                        {
                            newInnerHtml += "<span class='green'>" + currentWord + "</span>" + currentChar;
                            currentWord = '';
                        }
                        else
                        {
                            currentWord += currentChar;
                        }
                        break;
                    case ' ':
                        if (state === 'text')
                        {
                            newInnerHtml = newInnerHtml.concat(this.highlight(currentWord)) + currentChar;
                            currentWord = '';
                        }
                        else if (state === 'string')
                        {
                            currentWord += currentChar;
                        }
                        break;

                    case '"':
                    case "'":
                        if (state === 'text')
                        {
                            newInnerHtml += "<span class='green'>";
                            currentWord += currentChar;
                            state = 'string';
                        }
                        else if (state === 'string')
                        {
                            newInnerHtml += this.highlight(currentWord + currentChar) + "</span>";
                            currentWord = '';
                            state = 'text';
                        }
                        break;

                    default:
                        currentWord += currentChar;
                        break;
                }

            }
            codeBlocks[blocksIndex].innerHTML = newInnerHtml + this.highlight(currentWord);
        }
    }

    highlight(word)
    {
        for (var color in this.highlightedKeywords)
        {
            for (var keyword in this.highlightedKeywords[color])
            {
                if (word == this.highlightedKeywords[color][keyword])
                {
                    return "<span class='" + color + "'>" + word + "</span>";
                }
            }
        }
        return word;
    }
};
