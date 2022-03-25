let type = process.argv.splice(2)[0] || '';
module.exports = {
  NODE_ENV: '"production"',
	// NODE_ENV: '"development"' ,//为了发布后请求模拟数据，进行本地测试 ，  暂时改成 开发模式标识
	TYPE:type,
}
