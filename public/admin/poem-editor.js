(function () {
    if (typeof window === 'undefined' || !window.CMS) return;

    var h = window.h;

    function escapeHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderPreview(value) {
        var blocks = (value || '').split(/\n{2,}/);
        var html = blocks.map(function (block) {
            var m = block.match(/^<div class="align-(left|center|right|justify)">\n?([\s\S]*?)\n?<\/div>$/);
            var align = 'left';
            var content = block;
            if (m) {
                align = m[1];
                content = m[2];
            }
            var lines = content.split('\n').map(escapeHtml).join('<br>');
            var style = align !== 'left' ? ' style="text-align:' + align + '"' : '';
            return '<p' + style + '>' + lines + '</p>';
        });
        return html.join('');
    }

    var PoemEditorControl = createClass({
        getInitialState: function () {
            return { value: this.props.value || '' };
        },

        componentDidUpdate: function (prevProps) {
            if (prevProps.value !== this.props.value && this.textarea && this.textarea.value !== this.props.value) {
                this.setState({ value: this.props.value || '' });
            }
        },

        handleChange: function (e) {
            var value = e.target.value;
            this.setState({ value: value });
            this.props.onChange(value);
        },

        setRef: function (el) {
            this.textarea = el;
        },

        getBlockRange: function () {
            var ta = this.textarea;
            var value = this.state.value;
            var start = ta.selectionStart;
            var end = ta.selectionEnd;
            if (start === end) {
                var before = value.slice(0, start);
                var after = value.slice(end);
                var bs = before.lastIndexOf('\n\n');
                start = bs === -1 ? 0 : bs + 2;
                var be = after.indexOf('\n\n');
                end = be === -1 ? value.length : end + be;
            }
            return { start: start, end: end };
        },

        applyAlign: function (align) {
            var ta = this.textarea;
            var value = this.state.value;
            var range = this.getBlockRange();
            var block = value.slice(range.start, range.end);
            var m = block.match(/^<div class="align-(left|center|right|justify)">\n?([\s\S]*?)\n?<\/div>$/);
            var newBlock;
            if (m) {
                if (m[1] === align) {
                    newBlock = m[2];
                } else {
                    newBlock = '<div class="align-' + align + '">\n' + m[2] + '\n</div>';
                }
            } else if (align !== 'left') {
                newBlock = '<div class="align-' + align + '">\n' + block.trim() + '\n</div>';
            } else {
                newBlock = block;
            }
            var newValue = value.slice(0, range.start) + newBlock + value.slice(range.end);
            var self = this;
            this.setState({ value: newValue }, function () {
                self.props.onChange(newValue);
            });
            requestAnimationFrame(function () {
                if (!self.textarea) return;
                self.textarea.focus();
                self.textarea.setSelectionRange(range.start, range.start + newBlock.length);
            });
        },

        wrapSelection: function (before, after) {
            var ta = this.textarea;
            var value = this.state.value;
            var start = ta.selectionStart;
            var end = ta.selectionEnd;
            var sel = value.slice(start, end) || '';
            var newValue = value.slice(0, start) + before + sel + after + value.slice(end);
            var self = this;
            this.setState({ value: newValue }, function () {
                self.props.onChange(newValue);
            });
            requestAnimationFrame(function () {
                if (!self.textarea) return;
                self.textarea.focus();
                self.textarea.setSelectionRange(start + before.length, end + before.length);
            });
        },

        render: function () {
            var self = this;
            return h('div', { className: 'poem-editor' },
                h('div', { className: 'poem-editor-toolbar' },
                    h('button', { type: 'button', className: 'poem-editor-btn', title: 'Tebal', onClick: function () { self.wrapSelection('**', '**'); } }, 'B'),
                    h('button', { type: 'button', className: 'poem-editor-btn', title: 'Miring', onClick: function () { self.wrapSelection('*', '*'); } }, 'I'),
                    h('span', { className: 'poem-editor-sep' }),
                    h('button', { type: 'button', className: 'poem-editor-btn', title: 'Rata kiri', onClick: function () { self.applyAlign('left'); } }, 'Left'),
                    h('button', { type: 'button', className: 'poem-editor-btn', title: 'Rata tengah', onClick: function () { self.applyAlign('center'); } }, 'Center'),
                    h('button', { type: 'button', className: 'poem-editor-btn', title: 'Rata kanan', onClick: function () { self.applyAlign('right'); } }, 'Right'),
                    h('button', { type: 'button', className: 'poem-editor-btn', title: 'Rata kiri-kanan', onClick: function () { self.applyAlign('justify'); } }, 'Justify')
                ),
                h('textarea', {
                    ref: this.setRef,
                    className: 'poem-editor-textarea',
                    value: this.state.value,
                    onChange: this.handleChange,
                    placeholder: 'Tulis bait di sini. Tekan Enter untuk baris baru, kosongkan satu baris untuk bait baru.'
                })
            );
        }
    });

    var PoemEditorPreview = createClass({
        render: function () {
            return h('div', {
                className: 'poem-editor-preview',
                dangerouslySetInnerHTML: { __html: renderPreview(this.props.value || '') }
            });
        }
    });

    window.CMS.registerWidget('poem-editor', PoemEditorControl, PoemEditorPreview);
})();