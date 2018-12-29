var path = require("path")
var fs = require("fs")
var url = require("url")

var gulp = require("gulp")
var sass = require("gulp-sass")
var concat = require("gulp-concat") //合并文件
var autoprefixer = require("gulp-autoprefixer") //自动添加前缀
var clean = require("gulp-clean-css") //压缩css
var htmlmin = require("gulp-htmlmin") //压缩tml
var imagemin = require("gulp-imagemin") //压缩img
var uglifymin = require("gulp-uglify") //压缩js文件
var webserver = require("gulp-webserver") //起服务


var data = require("./src/data.json")
console.log(data)
    //克隆文件
gulp.task("copy", function() {
    return gulp.src("./src/js/**/*.js")
        .pipe(gulp.dest("./build/js"))
})

//编译scss
gulp.task("minscss", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ["last 2 versions"]
        }))
        .pipe(concat("all.css"))
        // .pipe(clean())
        .pipe(gulp.dest("./src/css/"))
})

//监听scss
gulp.task("watch", function() {
    return gulp.watch("./src/scss/*.scss", gulp.series("minscss"))
})

//压缩html
gulp.task("htmlmin", function() {
        return gulp.src("./src/*.html")
            .pipe(htmlmin({
                collapseWhitespace: true
            }))
            .pipe(gulp.dest("./build/"))
    })
    //压缩图片
gulp.task("imagemin", function() {
        return gulp.src("./src/img/*.{jpg,png,gif}")
            .pipe(imagemin({
                optimizationLevel: 6
            }))
            .pipe(gulp.dest("./build/img/"))
    })
    //压缩js
gulp.task("uglifymin", function() {
        return gulp.src(["./src/js/*.js"])
            .pipe(concat("all.js"))
            .pipe(uglifymin())
            .pipe(gulp.dest("./build/js"))
    })
    //起服务
gulp.task("webserver", function() {
    return gulp.src("src")
        .pipe(webserver({
            port: 8989, //配置端口号
            open: true, //自动打开浏览器
            livereload: true, //自动刷新
            // host: "192.168.0.222",
            fallback: "index.html",
            middleware: function(req, res, next) { //拦截前端请求
                var pathname = url.parse(req.url).pathname

                if (pathname == "/favicon.ico") {
                    res.end("")
                    return
                }

                if (pathname === "/list") {
                    res.end(JSON.stringify(data))
                } else {
                    pathname = pathname === "/" ? "index.html" : pathname
                    res.end(fs.readFileSync(path.join(__dirname, "src", pathname)))
                }

            }
        }))
})