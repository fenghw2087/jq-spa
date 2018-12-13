/**
 * Created by Administrator on 2018/8/9.
 */
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry:{ vonder: path.resolve(__dirname, './src/sp/vendor.js'), index: path.resolve(__dirname, './src/sp/index.js') },
    output:{
        filename: 'js/[name].js',//'js/[name]-[chunkhash].js',
        path: path.join(__dirname, './dist'),
    },
    externals: {
        'jquery': 'window.jQuery',
        'angular': 'window.angular',
        'echarts': 'window.echarts',
        'BMap':'window.BMap'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader?minimize", "postcss-loader"]
            })
        },{
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader?minimize", "postcss-loader", `less-loader?{modifyVars:${JSON.stringify({ mainColor:'#1089ff' })}}`]
            })
        },{
            test: /\.js$/,
            use: ['babel-loader?cacheDirectory=true'],
            include: path.join(__dirname, './src')
        },{
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name:'images/[name].[ext]',
                    publicPath:'/'
                }
            }]
        },{
            test: /\.(woff|svg|eot|TTF|ttf)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name:'font/[name].[ext]',
                    publicPath:'/'
                }
            }]
        }]
    },
    plugins:[
        new CleanWebpackPlugin([
            path.join('./dist', 'js/*.js'),
            path.join('./dist', 'css/*.css'),
            path.join('./dist', 'images/*.*'),
            path.join('./dist', 'font/*.*')
        ],{
            root: path.join(__dirname, './'),
            verbose: true
        }),
        new UglifyJSPlugin(),
        new HtmlWebpackPlugin({
            template: './src/sp/index.html', // 源模板文件
            filename: './index.html', // 输出文件【注意：这里的根路径是module.exports.output.path】
            showErrors: true,
            inject: 'body',
            chunks: ['vonder','index']
        }),
        new webpack.HashedModuleIdsPlugin(),
        new ExtractTextPlugin({
            filename: 'css/[name].css',//'css/[name]-[chunkhash].css',
            allChunks:true
        }),
        new webpack.DefinePlugin({
            _DEV_:JSON.stringify('prod')
        })
    ]
};
