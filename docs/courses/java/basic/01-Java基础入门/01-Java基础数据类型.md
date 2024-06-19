---
title: Java基础数据类型
author: Noah
date: 2024/06/17 14:11
categories: 
 - Java基础入门
tags:
 - Java
 - 基础
 - JDK
 - 数据类型
---
# Java基础数据类型

[[toc]]

::: tip TIPS🚀
`Java` 的数据类型分为两大类：基础数据类型和引用数据类型。<br/>
其中基础数据类型分为三大类: 字符型、数值型、布尔型
:::


|    数据类型     | 位数  |  默认值  |      取值范围      |       举例说明        |
| :---------: | :-: | :---: | :------------: | :---------------: |
|   byte(位)   |  8  |   0   |  -2^7 - 2^7-1  |   byte b = 10;    |
| short(短整数)  | 16  |   0   | -2^15 - 2^15-1 |   short s = 10;   |
|   int(整数)   | 32  |   0   | -2^31 - 2^31-1 |    int i = 10;    |
|  long(长整数)  | 64  |   0   | -2^63 - 2^63-1 |   long l = 10l;   |
| float(单精度)  | 32  |  0.0  | -2^31 - 2^31-1 | float f = 10.0f;  |
| double(双精度) | 64  |  0.0  | -2^63 - 2^63-1 | double d = 10.0d; |
|  char(字符)   | 16  | null  |    0-2^16-1    |   char c = 'c';   |
| boolean(布尔) |  8  | false |   true,false   | boolean b = true; |
## 整型
>`byte`
>>**占用内存:** 1字节(8位)<br/>
>>**数值范围:**-128到127<br/>
>>**用途:** 占用内存较小，适用于大数组场景。例如，图片处理中的像素值

***

>`short`
>>**占用内存: **2字节(16位)<br/>
>>**数值范围:** -32,768到32,767<br/>
>>**用途:** 用于需要必`byte`更大但又不需要`int`那么大范围的场景。常用语处理在网络传输的协议

***

>`int`
>>**占用内存:** 4字节(32位)<br/>
>>**数值范围:** -2,147,483,648到2,147,483,647<br/>
>>**用途: **`Java`中最常用的整数型类型，适用于大部分的整型数值需求。

***

>`long`
>>**占用内存:** 4字节(32位)<br/>
>>**数值范围:** -9,223,372,036,854,775,808到9,223,372,036,854,775,807
>>**用途:** 用于需要比`int`更大范围的场景，例如处理大量数据的程序(如大程序)、时间戳

***

::: tip TIPS🚀
二进制整数（以0b或者0B开头），如：0b00001011<br/>
八进制整数（以0开头），如：016<br/>
十进制整数（默认），如：100，-350，0<br/>
十六进制整数（以0x或0X开头），如：0x16
:::
::: details 查看代码👍
```java
public class IntegerTypes{
	public static void main(String[] args){
		int i = 0b10000; // 二进制
		short s = 020; // 八进制
		byte b = 16; // 十进制
		long l = 0x10; // 十六进制
		System.out.println("i="+i);
		System.out.println("s="+s);
		System.out.println("b="+b);
		System.out.println("l="+l);
	}
}
```
:::
::: details 查看运行结果👀
结果
```
i=16
s=16
b=16
l=16
```
:::
### 注意事项
::: warning **注意**💡 
* 数值超出相应范围会导致编译时错误，例如，`byte b = 128`，因为`128`超出了`byte`的范围。
* long类型的数字声明时需要加上 `L` 或 `l` 后缀以表示它是长整型，否则编译器会默认为 `int` 处理
:::
## 浮点型
>`float`
>>**占用内存:** 4字节(32位)<br/>
>>**数值范围: **大约为-1.4E-45到3.4E38<br/>
>>**精度:** 约7位十进制数<br/>
>>**用途: **适用于对精度要求不高且需要节省内存的场景，如游戏开发中的物理引擎计算等。

***

>`double`
>>**占用内存:** 8字节(64位)<br/>
>>**数值范围:** 大约为-4.9E-324到1.7E308<br/>
>>**精度:** 约15位十进制数<br/>
>>**用途:** 常用的默认浮点类型，适用于对精度要求较高的场景，如科学计算，金融分析等。

***

::: tip TIPS🚀
Java浮点类型常量有两种表示:<br/>
- 十进制数形式: 6.66、666.0、0.666<br/>
- 科学计数法形式: 314e2、314E2、314E-2
:::
::: details 查看代码👍
```java
public class FloatingPointTypes {
    public static void main(String[] args) {
        float floatVar = 3.14F; // 注意：需要加上F或f表示float类型
        double doubleVar = 3.141592653589793;

        System.out.println("float 变量: " + floatVar);
        System.out.println("double 变量: " + doubleVar);
    }
}

```
:::
::: details 查看运行结果👀
结果
```
float 变量: 3.14
double 变量: 3.141592653589793
```
:::

### 注意事项
#### 1.精度问题
浮点数在表达和计算时可能会出现精度问题，特别是在涉及到高精度计算的场景下。例如:
::: warning **注意**💡 
```java
System.sout.println(0.1 + 0.2); // 输出结果可能不是0.3，而是0.30000000000004
```
这是因为浮点数在二进制存储时的一些特性决定的。
:::
#### 2.浮点数比较
由于精度问题，直接比较浮点数可能会导致错误结果，通常需要定义一个精度范围，例如：
::: warning **注意**💡 
```java
double a = 0.1 + 0.2;
double b = 0.3;
final double EPSILON = 1E-10;
if (Math.abs(a - b) < EPSILON) {
    System.out.println("a 和 b 相等");
} else {
    System.out.println("a 和 b 不相等");
}
```
:::
在开发过程中，根据不同的应用场景选择合适的浮点类型可以更好地满足性能和精度要求！

## 字符型
>`char`
>> **占用内存：**: 2字节(16位)
>> **数值范围：** `'\u0000'` (即0) 到 `'\uffff'` (即65,535)
>> **表示范围：** 包括基本拉丁字母、汉字、符号、控制字符等所有Unicode字符
### 使用示例

::: details 查看代码
```java
public class CharExample {
    public static void main(String[] args) {
        char ch1 = 'A'; // 直接使用字符字面量
        char ch2 = 66;  // 使用字符的Unicode值，即 'B'
        char ch3 = '\u0043'; // 使用Unicode编码，即 'C'

        System.out.println("字符1: " + ch1);
        System.out.println("字符2: " + ch2);
        System.out.println("字符3: " + ch3);
    }
}
```
:::
::: details 查看结果
```java
字符1: A
字符2: B
字符3: C
```
:::
### `char`的操作
1. **字符和整数的对应关系：**
   在Java中，字符实际上是一个无符号的16位数值，因此可以与整数进行转换。
   ```java
   char ch = 'a';
   int ascii = ch; // 将字符 'a' 转换为对应的ASCII值，即97
   System.out.println("ASCII of 'a': " + ascii);

   int code = 100;
   char character = (char) code; // 将整数100转换为对应的字符，即 'd'
   System.out.println("Character for code 100: " + character);
   ```

2. **字符的比较：**
   `char`类型的比较实际上是比较它们对应的Unicode编码值。
   ```java
   char ch1 = 'A';
   char ch2 = 'B';
   if (ch1 < ch2) {
       System.out.println(ch1 + " 小于 " + ch2);
   } else {
       System.out.println(ch1 + " 不小于 " + ch2);
   }
   ```

3. **常见转义字符：**
   Java中还支持一些转义字符，例如：
   - `\n`：换行
   - `\t`：制表符
   - `\'`：单引号
   - `\"`：双引号
   - `\\`：反斜杠
   ```java
   public class EscapeSequenceExample {
       public static void main(String[] args) {
           System.out.println("Hello\nWorld"); // 换行
           System.out.println("Hello\tWorld"); // 制表符
           System.out.println("She said: \"Hello!\""); // 双引号
       }
   }
   ```

### 注意事项

::: warning **注意**💡 
- `char`用于表示单个字符，若需要表示字符串（多个字符），则使用`String`类。
- `char`类型的变量在内存中以Unicode编码存储，这使得Java可以处理国际化字符。
:::

## 布尔型
>`boolean`:
>>**占用内存：** 在JVM规范中并没有明确规定，但通常实现为1位或1字节。
>>**数值范围：** 取值为`true`或`false`
>>**用途：** 常用于条件判断和逻辑运算。

### 使用示例
::: details 查看代码
```java
public class BooleanExample {
    public static void main(String[] args) {
        boolean isJavaFun = true;
        boolean isFishTasty = false;

        System.out.println("Java is fun: " + isJavaFun);
        System.out.println("Fish is tasty: " + isFishTasty);

        // 使用布尔变量进行条件判断
        if (isJavaFun) {
            System.out.println("Java真有意思！");
        } else {
            System.out.println("Java一点都不有意思。");
        }
    }
}
```
:::
::: details 查看结果
```
Java is fun: true
Fish is tasty: false
Java真有意思！
```
:::
### 布尔型的操作
1. **基本逻辑运算：**
   - **与 (`&&`)：** 两个操作数均为`true`时，结果为`true`；否则为`false`。
   - **或 (`||`)：** 其中一个操作数为`true`时，结果为`true`；都为`false`时结果才为`false`。
   - **非 (`!`)：** 操作数为`true`时结果为`false`；操作数为`false`时结果为`true`。
   ```java
   boolean a = true;
   boolean b = false;

   System.out.println("a && b: " + (a && b)); // false
   System.out.println("a || b: " + (a || b)); // true
   System.out.println("!a: " + (!a)); // false
   System.out.println("!b: " + (!b)); // true
   ```

2. **比较运算：**
   布尔类型的值通常是比较运算或逻辑运算的结果，例如：
   ```java
   int x = 5;
   int y = 10;
   boolean result = x < y;
   System.out.println("x < y: " + result); // true
   ```

3. **条件控制：**
   布尔型广泛应用于条件控制结构中，例如`if-else`语句：
   ```java
   int age = 20;
   boolean isAdult = age >= 18;

   if (isAdult) {
       System.out.println("你是成年人。");
   } else {
       System.out.println("你还未成年。");
   }
   ```

### 注意事项
::: warning **注意**💡 
- `boolean`不能直接与整数类型互相转换，且不能执行位操作。
- 与其他编程语言中使用`0`和非`0`代表`false`和`true`不同，Java中的布尔`true`和`false`是关键字，没有与数值形式的转换。
- `boolean`类型在逻辑判断、条件控制中具有不可替代的重要作用。
:::