import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function App() {
  const ref = useRef('');
  const changeRef = useRef(false);
  const changeCountRef = useRef(0)
  
  const [post, setPost] = useState<string[]>(() => {
    const data = localStorage.getItem("data")
    try {
       if (data)
      return JSON.parse(data)
    return []
    }
    catch (e) {
      localStorage.removeItem("data");
      return []
    }
  })
  const [content, setContent] = useState<string>(() => {
    const tmp = localStorage.getItem('tmp')
    return tmp ?? ""
  })

  //content가 바뀔 때 마다 로컬스토리지에 저장
  /* useEffect(() => {
    if (content.length > 0) {
      console.log(content)
      localStorage.setItem('tmp',content)
    }
  },[content]) */

  useEffect(() => {
    changeCountRef.current++;
    ref.current = content;
    changeRef.current = true;
    
    if (changeCountRef.current > 15) {
      changeCountRef.current = 0;
      changeRef.current = false;
      localStorage.setItem('tmp', ref.current)
      console.log("너무 많은 변화로 인해 저장")
    }
  },[content])

  useEffect(() => {
    const intv = setInterval(() => {
      console.log("인터벌 발생")
      if (changeRef.current) {
        console.log("값이 바뀜!", ref.current)
        localStorage.setItem('tmp', ref.current)
        changeRef.current = false
        changeCountRef.current = 0;
      }
    }, 10000)
    return () => clearInterval(intv)
  },[])
  return (
    <div>
      <div style={{
        position: "sticky",
        top: 0,
        backgroundColor: "white",
        paddingBottom: "8px",
        borderBottom: post.length > 0 ? "1px solid #eee" : ""
      }}>
        <button
          onClick={() => {
            if (content.length < 5) {
              alert('아무것도 입력되지 않았습니다');
              console.log(content.length);
              return;
            }

            localStorage.removeItem('tmp')

            setPost((prev) => {
              const rs = [...prev, content];
              localStorage.setItem('data', JSON.stringify(rs));
              return rs;
            });
          
            setContent('');
            
          }}
        >
          발행
        </button>
        <button
          onClick={() => {
            if (window.confirm('진짜 초기화 할건가요?')) {
              alert('초기화 완료되었습니다. 나중에 후회하지 마세요');
              localStorage.clear();
              setPost([]);
            }
          }}
        >
          전체 제거
        </button>
        <ReactQuill
          style={{
            margin: '8px',
          }}
          value={content}
          onChange={setContent}
          modules={{
            toolbar: [
              ['image'],
              ['bold', 'italic', 'underline', 'strike'], // toggled buttons
              ['blockquote', 'code-block'],

              [{header: 1}, {header: 2}], // custom button values
              [{list: 'ordered'}, {list: 'bullet'}],
              [{script: 'sub'}, {script: 'super'}], // superscript/subscript
              [{indent: '-1'}, {indent: '+1'}], // outdent/indent
              [{direction: 'rtl'}], // text direction

              [{size: ['small', false, 'large', 'huge']}], // custom dropdown
              [{header: [1, 2, 3, 4, 5, 6, false]}],

              [{color: []}, {background: []}], // dropdown with defaults from theme
              [{font: []}],
              [{align: []}],

              ['clean'], // remove formatting button/ dropdown with defaults from theme
            ],
          }}
        />
      </div>

      <div>
        {post.map((post, idx) => (
          <div
            key={idx}
            style={{
              padding: '8px',
              margin: '8px',
              border: 'solid 1px #CCC',
            }}
          >
            <div dangerouslySetInnerHTML={{__html: post}} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
