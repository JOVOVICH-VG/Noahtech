import{_ as i}from"./chunks/ArticleMetadata.DQky7sWC.js";import{_ as t,m as c,a as g,u as s,B as h,e as a,x as u,ah as L,o as r,p as b,q as p}from"./chunks/framework.Bi-mNMmX.js";import"./chunks/theme.BBp5a0Hw.js";const x=JSON.parse('{"title":"MySQL底层Log系统","description":"","frontmatter":{"title":"MySQL底层Log系统","author":"Noah","date":"2024/06/29 16:55","categories":["MySQL进阶"],"tags":["MySQL","事务","并发事务"]},"headers":[],"relativePath":"courses/mysql/02-MySQL进阶/02-MySQL底层Log系统.md","filePath":"courses/mysql/02-MySQL进阶/02-MySQL底层Log系统.md","lastUpdated":1719659320000}'),m={name:"courses/mysql/02-MySQL进阶/02-MySQL底层Log系统.md"},f=a("h1",{id:"mysql-底层-log-系统",tabindex:"-1"},[u("MySQL 底层 Log 系统 "),a("a",{class:"header-anchor",href:"#mysql-底层-log-系统","aria-label":'Permalink to "MySQL 底层 Log 系统"'},"​")],-1),q=L('<nav class="table-of-contents"><ul><li><a href="#mysql-的日志系统概述">MySQL 的日志系统概述</a></li><li><a href="#redo-log-详解">Redo Log 详解</a><ul><li><a href="#redo-log-的作用">Redo Log 的作用</a></li><li><a href="#redo-log-的结构">Redo Log 的结构</a></li><li><a href="#redo-log-的工作原理">Redo Log 的工作原理</a></li></ul></li><li><a href="#undo-log-详解">Undo Log 详解</a><ul><li><a href="#undo-log-的作用">Undo Log 的作用</a></li><li><a href="#undo-log-的结构">Undo Log 的结构</a></li><li><a href="#undo-log-的工作原理">Undo Log 的工作原理</a></li></ul></li><li><a href="#binary-log-详解">Binary Log 详解</a><ul><li><a href="#bin-log-的作用">bin log 的作用</a></li><li><a href="#bin-log-的结构">bin log 的结构</a></li><li><a href="#bin-log-的工作原理">bin log 的工作原理</a></li></ul></li><li><a href="#拓展">拓展</a><ul><li><a href="#多版本并发控制-mvcc">多版本并发控制(MVCC)</a></li></ul></li></ul></nav><h2 id="mysql-的日志系统概述" tabindex="-1">MySQL 的日志系统概述 <a class="header-anchor" href="#mysql-的日志系统概述" aria-label="Permalink to &quot;MySQL 的日志系统概述&quot;">​</a></h2><ol><li><strong>重做日志(Redo Log):</strong> <code>InnoDB</code> 存储引擎特有的日志，用于保证事务的持久性(Durability)。当事务提交时，数据首先写入 <code>Redo Log</code> ，然后再更新到实际的数据文件中。如果系统崩溃，重启后可以通过 <code>Redo Log</code> 恢复已提交的事务。</li><li><strong>回滚日志(Undo Log):</strong> <code>InnoDB</code> 存储引擎特有的日志，用于支持事务的原子性(Atomicity)和隔离性(Isolation)。当事务执行修改操作时，<code>Undo Log</code> 记录修改前的数据副本。如果事务回滚，可以通过<code>Undo Log</code> 恢复数据到修改前的状态。此外，<code>Undo Log</code> 还用于支持多版本并发控制(MVCC)，以实现一致性读取。</li><li><strong>二进制日志(Binary Log，简称bin log):</strong> 记录所有对数据库进行了修改的SQL语句，包括增、删、改。 <code>bin log</code> 主要用于复制和数据恢复。</li><li><strong>中继日志(Realy Log):</strong> 从主节点的 <code>bin log</code> 传到从节点后，被写到 <code>realy log</code> 主节点一般不需要开启该日志</li><li><strong>错误日志(Error Log):</strong> 记录 <code>MySQL</code> 服务器启动、运行或停止过程中的错误、警告和注意事项。</li><li><strong>慢查询日志(Slow Query Log):</strong> 记录执行时间超过指定阈值的查询语句，用于优化数据库性能。</li><li><strong>通用查询日志(General Query Log):</strong> 记录MySQL服务器接收到的所有SQL语句，常用于调试。</li></ol><p><img src="https://raw.githubusercontent.com/Noah2Y/img/main/blog/20240629173903.png" alt=""></p><h2 id="redo-log-详解" tabindex="-1">Redo Log 详解 <a class="header-anchor" href="#redo-log-详解" aria-label="Permalink to &quot;Redo Log 详解&quot;">​</a></h2><p><code>Redo Log</code> 是 <code>MySQL</code> 中 <code>InnoDB</code> 存储引擎实现事务持久化(Durability)的关键组件。它确保了系统在发生崩溃时，能够通过日志恢复已提交的事务，保持数据的一致性和完整性。</p><h3 id="redo-log-的作用" tabindex="-1">Redo Log 的作用 <a class="header-anchor" href="#redo-log-的作用" aria-label="Permalink to &quot;Redo Log 的作用&quot;">​</a></h3><ol><li><strong>持久化保障:</strong> 确保事务修改提交后不会因系统崩溃而丢失。</li><li><strong>崩溃恢复:</strong> 系统崩溃后，可以用功 <code>Redo Log</code> 恢复已提交的事务。</li><li><strong>提高性能:</strong> 通过先写日志再写数据也的方式，减少了频繁的磁盘I/O操作。</li></ol><h3 id="redo-log-的结构" tabindex="-1">Redo Log 的结构 <a class="header-anchor" href="#redo-log-的结构" aria-label="Permalink to &quot;Redo Log 的结构&quot;">​</a></h3><ul><li><p><strong>Redo Log Buffer:</strong> 位于内存中，用于暂存 <code>Redo Log</code> 的内容。事务在执行过程中会将修改操作记录到 <code>Redo Log Buffer</code> 中。</p></li><li><p><strong>Redo Log 文件:</strong> 位于磁盘中，<code>Redo Log Buffer</code> 中的内容会周期性地刷新到 <code>Redo Log</code> 文件中。 通常有两个或多个文件组成。</p></li></ul><h3 id="redo-log-的工作原理" tabindex="-1">Redo Log 的工作原理 <a class="header-anchor" href="#redo-log-的工作原理" aria-label="Permalink to &quot;Redo Log 的工作原理&quot;">​</a></h3><ol><li><strong>记录修改:</strong> 当事务执行修改操作时，会将修改记录写入 <code>Redo Log Buffer</code> 中。</li><li><strong>日志刷新:</strong> 当事务提交时， <code>InnoDB</code> 存储引擎会将 <code>Redo Log Buffer</code> 中的内容刷新到 <code>Redo Log</code> 文件中(称为“刷盘”)</li><li><strong>事务提交:</strong> 确保 <code>Redo Log</code>文件中的内容已经写入磁盘后，事务才会正则提交。</li><li><strong>循环写:</strong> <code>Redo Log</code> 文件组以循环方式使用，当写到文件末尾时，会回到文件开头继续写，但会确保不覆盖未提交的事务。</li></ol><h2 id="undo-log-详解" tabindex="-1">Undo Log 详解 <a class="header-anchor" href="#undo-log-详解" aria-label="Permalink to &quot;Undo Log 详解&quot;">​</a></h2><p><code>Undo Log</code> 是 <code>MySQL </code>中 <code>InnoDB</code> 存储引擎实现事务原子性和隔离性的关键组件。它记录了事务执行过程中数据修改前的状态，用于在事务回滚时恢复数据，同时在多版本并发控制，即 <code>MVCC</code> ，中也起到了总要的作用。</p><h3 id="undo-log-的作用" tabindex="-1">Undo Log 的作用 <a class="header-anchor" href="#undo-log-的作用" aria-label="Permalink to &quot;Undo Log 的作用&quot;">​</a></h3><ol><li><strong>支持事务回滚:</strong> 当事务执行过程中出现错误或显示回滚时，通过 <code>Undo Log</code> 恢复数据到修改前的状态。</li><li><strong>实现MVCC:</strong> 多版本并发控制(MVCC)允许事务在读取数据时不阻塞写操作，通过保存数据的多个版本，确保读取操作看到的是一致的快做。</li></ol><h3 id="undo-log-的结构" tabindex="-1">Undo Log 的结构 <a class="header-anchor" href="#undo-log-的结构" aria-label="Permalink to &quot;Undo Log 的结构&quot;">​</a></h3><p><code>Undo Log</code> 由多个 <code>Undo Log</code> 段组成，每个<code>Undo Log</code> 段记录一组相关的修改操作。主要包括以下几种类型：</p><ol><li><strong>插入日志:</strong> 记录插入操作，事务回滚时会删除这些插入的数据。</li><li><strong>更新日志:</strong> 记录更新操作，事务回滚时会将数据恢复到更新前的状态。</li><li><strong>删除日志:</strong> 记录删除操作，事务回滚时会恢复被删除的数据。</li></ol><h3 id="undo-log-的工作原理" tabindex="-1">Undo Log 的工作原理 <a class="header-anchor" href="#undo-log-的工作原理" aria-label="Permalink to &quot;Undo Log 的工作原理&quot;">​</a></h3><ol><li><strong>记录修改前的状态:</strong> 当事务执行插入、删除或更新操作时，会生成该操作相反的操作记录在 <code>Undo Log</code> 中.</li><li><strong>链式结构:</strong> <code>Undo Log</code> 记录按照事务的执行顺序形成链式结构，每条记录包含一个指向前一条记录的指针(称为“回滚段”)。</li><li><strong>事务提交后保留:</strong> 即使事务提交后， <code>Undo Log</code> 记录仍然保留，用于支持 <code>MVCC</code> 读取操作。</li><li><strong>清理和回收:</strong> 当不再有事务需要访问 <code>Undo Log</code>记录时，这些记录会被清理和回收，以释放空间</li></ol><h2 id="binary-log-详解" tabindex="-1">Binary Log 详解 <a class="header-anchor" href="#binary-log-详解" aria-label="Permalink to &quot;Binary Log 详解&quot;">​</a></h2><p><code>bin log</code> 是MySQL中记录所有对数据库进行更改的事件日志文件，它用于主从复制和数据恢复。</p><h3 id="bin-log-的作用" tabindex="-1">bin log 的作用 <a class="header-anchor" href="#bin-log-的作用" aria-label="Permalink to &quot;bin log 的作用&quot;">​</a></h3><ol><li><strong>复制:</strong> 在主从复制中，主库将 <code>bin log</code> 传给从库，从库根据 <code>bin log</code> 操作，实现数据同步。</li><li><strong>数据恢复:</strong> 通过 <code>bin log</code> ，可以将数据库恢复到某个时间点或某个特定的事务状态。</li></ol><h3 id="bin-log-的结构" tabindex="-1">bin log 的结构 <a class="header-anchor" href="#bin-log-的结构" aria-label="Permalink to &quot;bin log 的结构&quot;">​</a></h3><p><code>bin log</code> 由一系列二进制文件组成，每个文件记录了一段时间内所有事务的更改操作。这些文件按照顺序编号，形成一个日志文件组。每个 <code>bin log</code> 文件由多个事件组成，每个事件记录了一次数据更改操作。</p><h3 id="bin-log-的工作原理" tabindex="-1">bin log 的工作原理 <a class="header-anchor" href="#bin-log-的工作原理" aria-label="Permalink to &quot;bin log 的工作原理&quot;">​</a></h3><ol><li><strong>事务开始:</strong> 在事务开始时，<code>MySQL</code> 会生成一个事务 ID，并为该事物记录日志。</li><li><strong>记录修改:</strong> 在事务执行过程中，每个修改操作都会生成一个事件并记录到 <code>bin log buffer</code> 中</li><li><strong>提交事务:</strong> 当事务提交时，<code>bin log buffer</code> 中的内容会被刷新到 <code>bin log</code> 文件中，确保事务的持久性。</li><li><strong>日志轮转:</strong> 当 <code>bin log</code> 文件达到指定大小时，会生成一个新的 <code>bin log</code> 文件，继续记录后续的操作。</li></ol><h2 id="拓展" tabindex="-1">拓展 <a class="header-anchor" href="#拓展" aria-label="Permalink to &quot;拓展&quot;">​</a></h2><h3 id="多版本并发控制-mvcc" tabindex="-1">多版本并发控制(MVCC) <a class="header-anchor" href="#多版本并发控制-mvcc" aria-label="Permalink to &quot;多版本并发控制(MVCC)&quot;">​</a></h3><p><code>MVCC</code> (Multi-Version Concurrency Control, 多版本并发控制) 是一种用于管理数据库并发访问的方法。它允许多个事务并发执行，而不会相互阻塞，从而提高系统的吞吐量和性能。<code>MVCC</code> 通过维护数据的多个版本，使得读取操作与写入操作可以同时进行，避免了传统锁机制带来的性能瓶颈。</p><h4 id="mvcc-的基本原理" tabindex="-1">MVCC 的基本原理 <a class="header-anchor" href="#mvcc-的基本原理" aria-label="Permalink to &quot;MVCC 的基本原理&quot;">​</a></h4><p><code>MVCC</code> 通过为每个数据行维护多个版本的副本，并在每个事务开始时生成一个时间戳(事务ID)，来实现并发控制，事务在读取数据时，依据时间戳决定读取那个版本的数据，从而实现一致性读取。</p><h4 id="mvcc-的主要机制" tabindex="-1">MVCC 的主要机制 <a class="header-anchor" href="#mvcc-的主要机制" aria-label="Permalink to &quot;MVCC 的主要机制&quot;">​</a></h4><ol><li><strong>数据版本管理:</strong> 每次数据修改操作都会生成一个新的数据版本，旧版本不会立即删除，而是保留用于并发事务读取。</li><li><strong>事务ID:</strong> 每个事务开始时都会获取到一个唯一的事务 ID， 事务 ID 用于标识事务的时间顺序。</li><li><strong>隐式列:</strong> <code>InnoDB</code> 存储引擎为每行属性添加两个隐式列：<code>trx_id</code> 和 <code>roll_pointer</code> 。<code>trx_id</code> 表示最后修改该行的事务ID，<code>roll_pointer</code> 指向 <code>Undo Log</code> 记录，用于恢复数据到之前的版本。</li></ol><h4 id="mvcc的工作原理" tabindex="-1">MVCC的工作原理 <a class="header-anchor" href="#mvcc的工作原理" aria-label="Permalink to &quot;MVCC的工作原理&quot;">​</a></h4><blockquote><p>读操作</p><blockquote><p>快照读：读取数据时，事务会更具自己的事务ID读取数据的一个快照版本，而不是直接读取当前最新的数。这种读取不会阻塞其他写操作。</p></blockquote><blockquote><p>一致性读取：通过事务ID和数据行的 <code>trx_id</code> ，事务会选择一个在事务开始前生成的数据版本进行读取，确保一致性。</p></blockquote><p>写操作</p><blockquote><p>写操作：写操作会生成新的数据版本，同时更新数据行的 <code>trx_id</code> 和 <code>roll_pointer</code> 。</p><p>提交事务：事务提交时，新的数据版本会成为最新版本，旧版本任然保留用于其他未提交的事务读取。</p><p>回滚操作：如果事务需要回滚，通过 <code>roll_pointer</code> 和Undo Log 恢复数据到修改前的状态。</p></blockquote></blockquote><h4 id="mvcc-的优缺点" tabindex="-1">MVCC 的优缺点 <a class="header-anchor" href="#mvcc-的优缺点" aria-label="Permalink to &quot;MVCC 的优缺点&quot;">​</a></h4><p><strong>优点：</strong></p><ol><li><p><strong>高并发性：</strong> 读操作无需加锁，不会阻塞写操作，提高了系统的并发性能。</p></li><li><p><strong>一致性读取：</strong> 事务读取的数据是一致的快照版本，避免了脏读、不可重复读等问题。</p></li><li><p><strong>性能优化：</strong> 减少了锁争用，提高了数据库整体性能</p></li></ol><p><strong>缺点：</strong></p><ol><li><strong>空间开销：</strong> 保留多个版本的副本和Undo Log记录会占用额外的存储空间。</li><li><strong>复杂性：</strong> 实现和回复MVCC机制相对复杂，可能会增加系统的开发和维护成本。</li></ol>',43);function C(o,y,_,M,k,R){const d=i,n=c("ClientOnly");return r(),g("div",null,[f,s(n,null,{default:h(()=>{var e,l;return[(((e=o.$frontmatter)==null?void 0:e.aside)??!0)&&(((l=o.$frontmatter)==null?void 0:l.showArticleMetadata)??!0)?(r(),b(d,{key:0,article:o.$frontmatter},null,8,["article"])):p("",!0)]}),_:1}),q])}const Q=t(m,[["render",C]]);export{x as __pageData,Q as default};
