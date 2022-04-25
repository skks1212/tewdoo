import React from "react";

export default function About() {

    return (
        <div>
            <br/>
            <div className="py-6 px-20">
                <h1 className="font-bold text-3xl">
                    About TewDoo
                </h1>
                <br/>
                <p tabIndex={0}>
                    TewDoo is a Kanban style task management app, made for GDC and Pupilfirst's WD 301 course's capstone project.
                    <br/>
                    Gotta say, I love react and typescript. 😌
                    <br/>
                    <br/>
                    Made with ❤️ by <a href="https://shivank.writeroo.in/" title="Shivank Kacker Website">Shivank Kacker</a>
                </p>
            </div>
            
        </div>
    );
}