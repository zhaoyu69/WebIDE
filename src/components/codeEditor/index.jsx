import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
// 编辑器样式
import 'codemirror/lib/codemirror.css';
// 语言类型 (C)
import 'codemirror/mode/clike/clike';
// 提示功能
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
// 提示语言类型
import 'codemirror/addon/hint/anyword-hint';
// 主题样式
import 'codemirror/theme/darcula.css';
// 全屏功能
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/display/fullscreen.js';

class CodeEditor extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            code:"/* C demo code */\n" +
            "\n" +
            "#include <zmq.h>\n" +
            "#include <pthread.h>\n" +
            "#include <semaphore.h>\n" +
            "#include <time.h>\n" +
            "#include <stdio.h>\n" +
            "#include <fcntl.h>\n" +
            "#include <malloc.h>\n" +
            "\n" +
            "typedef struct {\n" +
            "  void* arg_socket;\n" +
            "  zmq_msg_t* arg_msg;\n" +
            "  char* arg_string;\n" +
            "  unsigned long arg_len;\n" +
            "  int arg_int, arg_command;\n" +
            "\n" +
            "  int signal_fd;\n" +
            "  int pad;\n" +
            "  void* context;\n" +
            "  sem_t sem;\n" +
            "} acl_zmq_context;\n" +
            "\n" +
            "#define p(X) (context->arg_##X)\n" +
            "\n" +
            "void* zmq_thread(void* context_pointer) {\n" +
            "  acl_zmq_context* context = (acl_zmq_context*)context_pointer;\n" +
            "  char ok = 'K', err = 'X';\n" +
            "  int res;\n" +
            "\n" +
            "  while (1) {\n" +
            "    while ((res = sem_wait(&context->sem)) == EINTR);\n" +
            "    if (res) {write(context->signal_fd, &err, 1); goto cleanup;}\n" +
            "    switch(p(command)) {\n" +
            "    case 0: goto cleanup;\n" +
            "    case 1: p(socket) = zmq_socket(context->context, p(int)); break;\n" +
            "    case 2: p(int) = zmq_close(p(socket)); break;\n" +
            "    case 3: p(int) = zmq_bind(p(socket), p(string)); break;\n" +
            "    case 4: p(int) = zmq_connect(p(socket), p(string)); break;\n" +
            "    case 5: p(int) = zmq_getsockopt(p(socket), p(int), (void*)p(string), &p(len)); break;\n" +
            "    case 6: p(int) = zmq_setsockopt(p(socket), p(int), (void*)p(string), p(len)); break;\n" +
            "    case 7: p(int) = zmq_send(p(socket), p(msg), p(int)); break;\n" +
            "    case 8: p(int) = zmq_recv(p(socket), p(msg), p(int)); break;\n" +
            "    case 9: p(int) = zmq_poll(p(socket), p(int), p(len)); break;\n" +
            "    }\n" +
            "    p(command) = errno;\n" +
            "    write(context->signal_fd, &ok, 1);\n" +
            "  }\n" +
            " cleanup:\n" +
            "  close(context->signal_fd);\n" +
            "  free(context_pointer);\n" +
            "  return 0;\n" +
            "}\n" +
            "\n" +
            "void* zmq_thread_init(void* zmq_context, int signal_fd) {\n" +
            "  acl_zmq_context* context = malloc(sizeof(acl_zmq_context));\n" +
            "  pthread_t thread;\n" +
            "\n" +
            "  context->context = zmq_context;\n" +
            "  context->signal_fd = signal_fd;\n" +
            "  sem_init(&context->sem, 1, 0);\n" +
            "  pthread_create(&thread, 0, &zmq_thread, context);\n" +
            "  pthread_detach(thread);\n" +
            "  return context;\n" +
            "}\n",
            fullScreen:false
        }
    }

    render() {
        const {code, fullScreen} = this.state;
        const options = {
            // 行号
            lineNumbers: true,
            // 语言类型
            mode: {name: "text/x-csrc"},
            // 提示功能热键
            extraKeys: {
                "Ctrl": "autocomplete",
                "F11": this.fullScreenToggle,
                "Esc": this.fullScreenExit
            },
            // 主题
            theme: "darcula",
            // 全屏
            fullScreen,
        };
        return (
            <div>
                <h3>CodeMirror-C</h3>
                <CodeMirror options={options} onChange={this.codeChange} value={code}/>
                <button onClick={this.codeSave} style={{background:"#000",border:"none",padding:"5px 10px",color:"#fff",cursor:"pointer"}}>Save>></button>
            </div>
        );
    }

    fullScreenToggle=(cm)=>{
        this.setState({fullScreen:!cm.options.fullScreen})
    };

    fullScreenExit=(cm)=>{
        this.setState({fullScreen:false})
    };

    codeChange=(code)=>{
        this.setState({code});
    };

    codeSave=()=>{
        const {code} = this.state;
        console.log(code);
    }
}

export default CodeEditor;
