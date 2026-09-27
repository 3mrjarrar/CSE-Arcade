// Each tuple contains the question, correct answer, and three distractors.
// Answers are shuffled deterministically when a round starts.
export const questions = {
  1: {
    beginner: [
      ['What does CPU stand for?', 'Central Processing Unit', 'Computer Power Utility', 'Central Program User', 'Control Peripheral Unit'],
      ['Which number system uses only 0 and 1?', 'Binary', 'Decimal', 'Hexadecimal', 'Octal'],
      ['Which component loses its data when power is removed?', 'RAM', 'SSD', 'ROM', 'Hard disk'],
      ['What does a compiler do?', 'Translates source code into target code', 'Supplies power to a computer', 'Stores only images', 'Connects network cables'],
      ['Which unit measures electrical resistance?', 'Ohm', 'Volt', 'Ampere', 'Watt'],
    ],
    intermediate: [
      ['What is binary 1010 in decimal?', '10', '8', '12', '14'],
      ['What is the output of an AND gate with inputs 1 and 0?', '0', '1', '10', 'Undefined'],
      ['A 6 V source is across a 3 Ω resistor. What current flows?', '2 A', '18 A', '0.5 A', '9 A'],
      ['With zero-based indexing, which index selects the third array element?', '2', '3', '1', '4'],
      ['Which loop checks its condition after executing its body?', 'do–while', 'while', 'for', 'No loop can do this'],
    ],
    advanced: [
      ['What is the decimal value of 8-bit two’s-complement 11111100?', '−4', '252', '−3', '−124'],
      ['What does De Morgan’s law give for NOT (A AND B)?', '(NOT A) OR (NOT B)', '(NOT A) AND (NOT B)', 'A OR B', 'A AND (NOT B)'],
      ['How many times does a loop run for i = 1; i < 16; i *= 2?', '4', '3', '5', '16'],
      ['Two 6 Ω resistors are connected in parallel. What is their equivalent resistance?', '3 Ω', '12 Ω', '6 Ω', '36 Ω'],
      ['How many distinct values can an unsigned 8-bit integer represent?', '256', '255', '128', '512'],
    ],
  },
  2: {
    beginner: [
      ['Which data structure follows last in, first out?', 'Stack', 'Queue', 'Set', 'Graph'],
      ['What does a primary key uniquely identify?', 'A row in a table', 'A database server', 'A column type', 'An SQL command'],
      ['How many bits does a basic flip-flop store?', '1', '2', '4', '8'],
      ['What is a base case in recursion?', 'A condition that stops recursive calls', 'The first imported library', 'A sorting algorithm', 'A global variable'],
      ['Which OOP concept bundles state with related methods?', 'Encapsulation', 'Compilation', 'Scheduling', 'Normalization'],
    ],
    intermediate: [
      ['What is binary search’s worst-case time complexity on a sorted array?', 'O(log n)', 'O(n)', 'O(n²)', 'O(2ⁿ)'],
      ['Which traversal of a binary search tree returns keys in sorted order?', 'Inorder', 'Preorder', 'Postorder', 'Level order'],
      ['What does an SQL INNER JOIN return?', 'Rows that match the join condition in both tables', 'Every row from the left table', 'Only unmatched rows', 'The Cartesian product regardless of condition'],
      ['What is the sum bit of a half adder with inputs A and B?', 'A XOR B', 'A AND B', 'A OR B', 'NOT A'],
      ['Which structure is typically used for breadth-first search?', 'Queue', 'Stack', 'Heap only', 'Call stack only'],
    ],
    advanced: [
      ['What is the time complexity of T(n) = 2T(n/2) + n?', 'O(n log n)', 'O(n)', 'O(log n)', 'O(n²)'],
      ['Which condition characterizes second normal form?', '1NF with no partial dependency of non-key attributes on a candidate key', 'Every table has one column', 'No foreign keys are allowed', 'All non-key attributes must be unique'],
      ['In an AVL tree, what is the allowed height difference between a node’s subtrees?', 'At most 1', 'Exactly 0', 'At most 2', 'Unbounded'],
      ['What is the worst-case lookup time in a chained hash table with all keys in one bucket?', 'O(n)', 'O(1)', 'O(log n)', 'O(n log n)'],
      ['A 4-bit unsigned adder computes 1111 + 0001. What are carry-out and stored sum?', '1 and 0000', '0 and 0000', '1 and 1111', '0 and 1110'],
    ],
  },
  3: {
    beginner: [
      ['What is the main role of an operating system scheduler?', 'Choose which ready process runs next', 'Translate domain names', 'Encrypt every file', 'Compile source code'],
      ['Which protocol provides reliable, ordered byte delivery?', 'TCP', 'UDP', 'IP alone', 'ARP'],
      ['What is a cache primarily used for?', 'Reducing average data access time', 'Increasing disk capacity', 'Replacing every CPU register', 'Generating clock signals'],
      ['What is a process?', 'An instance of a program in execution', 'A physical network cable', 'A database column', 'A CPU instruction format'],
      ['What does DNS typically translate?', 'Domain names into IP addresses', 'Source code into machine code', 'MAC addresses into passwords', 'Images into text'],
    ],
    intermediate: [
      ['Which is a necessary condition for deadlock?', 'Circular wait', 'Unlimited resources', 'No mutual exclusion', 'Mandatory resource preemption'],
      ['How many usable host addresses are in a conventional IPv4 /24 subnet?', '254', '256', '255', '128'],
      ['What causes a page fault?', 'Access to a virtual page that is not currently resident in physical memory', 'Any cache miss', 'Any divide instruction', 'A full CPU register'],
      ['Which pipeline hazard occurs when an instruction needs an earlier instruction’s unfinished result?', 'Data hazard', 'Control hazard', 'Power hazard', 'Clock drift'],
      ['What does a mutex protect?', 'A critical section against simultaneous access', 'A packet against all loss', 'A disk against power failure', 'A process against compilation'],
    ],
    advanced: [
      ['A cache has a 2 ns hit time, 5% miss rate, and 60 ns additional miss penalty. What is AMAT?', '5 ns', '3 ns', '62 ns', '60 ns'],
      ['With 4 KiB pages, how many address bits form the page offset?', '12', '10', '16', '4'],
      ['What can cause Belady’s anomaly?', 'Increasing frames under FIFO can increase page faults', 'LRU always increases faults with more frames', 'A larger page always removes all faults', 'A TLB hit always causes a fault'],
      ['For a 32-bit byte address, a direct-mapped 4 KiB cache uses 16-byte blocks. How many tag bits?', '20', '16', '24', '12'],
      ['Why does TCP use a congestion window?', 'To limit outstanding data based on network congestion', 'To assign MAC addresses', 'To remove the need for acknowledgments', 'To set the receiver’s disk size'],
    ],
  },
  4: {
    beginner: [
      ['What does an ADC convert?', 'An analog signal into digital samples', 'Digital samples into an analog signal', 'AC power into DC power only', 'Source code into assembly'],
      ['What distinguishes a hard real-time task?', 'Missing a deadline is unacceptable for correct operation', 'It always has a graphical interface', 'It never uses interrupts', 'It must run on the fastest CPU'],
      ['What is an interrupt?', 'An event that requests processor attention', 'A permanent CPU failure', 'An SQL transaction', 'A type of resistor'],
      ['Which property does encryption primarily provide?', 'Confidentiality', 'Availability in every failure', 'Guaranteed low latency', 'Automatic backup'],
      ['What is the role of a watchdog timer?', 'Detect a stalled system and trigger recovery', 'Increase memory capacity', 'Measure screen brightness', 'Replace an operating system'],
    ],
    intermediate: [
      ['For an ideal band-limited signal up to 4 kHz, which sampling rate is above the Nyquist rate?', '10 kHz', '4 kHz', '6 kHz', '2 kHz'],
      ['Why are interrupt service routines usually kept short?', 'To reduce interrupt latency and blocking', 'To increase source file size', 'To disable scheduling forever', 'To avoid all use of registers'],
      ['What is priority inversion?', 'A high-priority task waits for a resource held by a lower-priority task', 'A low-priority task becomes a compiler', 'All tasks get identical deadlines', 'Priorities are stored in reverse order'],
      ['What is the main purpose of a digital signature?', 'Verify message origin and integrity', 'Compress a message', 'Guarantee message secrecy', 'Reduce network latency'],
      ['Why use DMA for a large peripheral transfer?', 'Transfer data with less per-byte CPU involvement', 'Eliminate all memory access', 'Encrypt data automatically', 'Make interrupts impossible'],
    ],
    advanced: [
      ['For independent preemptible periodic tasks with deadlines equal to periods, what is the ideal EDF utilization limit on one CPU?', '100%', '50%', '69.3%', '200%'],
      ['What does a two-flop synchronizer primarily reduce?', 'The chance of metastability propagating across clock domains', 'The need for all clock signals', 'The width of every data bus', 'All multi-bit coherency problems'],
      ['An ideal 12-bit ADC spans 0–3.3 V. What is its approximate LSB size using 3.3/4096?', '0.806 mV', '3.3 mV', '12 mV', '80.6 mV'],
      ['Why must a nonce not repeat under the same AES-GCM key?', 'Reuse can break confidentiality and authentication', 'Reuse only doubles the ciphertext length', 'Reuse reduces the key to zero bits immediately', 'Reuse merely slows decryption'],
      ['What does priority inheritance do when a high-priority task blocks on a mutex?', 'Temporarily raises the lock holder’s priority', 'Deletes the lock holder', 'Makes the mutex permanently unlocked', 'Lowers every task’s priority'],
    ],
  },
  5: {
    beginner: [
      ['What is fault tolerance?', 'Continuing service despite some component failures', 'Preventing every possible failure', 'Removing every backup', 'Ignoring all error messages'],
      ['What is horizontal scaling?', 'Adding more machines or instances', 'Adding RAM to one machine only', 'Increasing one CPU’s clock', 'Reducing all replicas to one'],
      ['What does a load balancer do?', 'Distributes requests across service instances', 'Compiles all services', 'Permanently stores every packet', 'Replaces all databases'],
      ['What is the purpose of a version control system?', 'Track and coordinate changes to project files', 'Guarantee bug-free software', 'Run CPU instructions', 'Measure network voltage'],
      ['What does inference mean in machine learning?', 'Using a trained model to produce predictions', 'Collecting only training labels', 'Replacing every weight with zero', 'Encrypting a dataset'],
    ],
    intermediate: [
      ['What makes an operation idempotent?', 'Repeating it has the same intended effect as doing it once', 'It always returns a random result', 'It must run exactly twice', 'It never uses a network'],
      ['What does eventual consistency mean?', 'Replicas converge if updates stop and communication continues', 'All reads always see the latest write', 'Writes cannot be replicated', 'Data is never allowed to change'],
      ['Why use a circuit breaker between services?', 'Stop repeated calls to a failing dependency temporarily', 'Guarantee no server ever fails', 'Replace authentication', 'Increase retries without limit'],
      ['What does p99 latency describe?', 'A latency threshold at or below which 99% of measured requests fall', 'The average of 99 requests', 'The fastest 1% of requests only', 'The maximum possible latency'],
      ['Why keep a test set separate from model training?', 'Estimate performance on unseen data', 'Guarantee perfect predictions', 'Increase the training set size', 'Choose every weight directly from the test labels'],
    ],
    advanced: [
      ['During a network partition, what tradeoff does CAP describe?', 'A system cannot guarantee both linearizable consistency and availability', 'A system must lose all stored data', 'A system cannot use replication', 'A system must stop all local computation'],
      ['A Raft cluster has five voting nodes. How many form a majority?', '3', '2', '4', '5'],
      ['If 20% of a program is serial, what is its theoretical maximum speedup with unlimited processors?', '5×', '20×', '80×', 'Unlimited'],
      ['Why is a transactional outbox useful?', 'It atomically stores a database change and an event to publish later', 'It guarantees a network can never partition', 'It removes the need for consumers', 'It makes every message arrive exactly once without deduplication'],
      ['For N = 5 replicas, which read/write quorum pair has R + W > N?', 'R = 3, W = 3', 'R = 2, W = 2', 'R = 1, W = 4', 'R = 2, W = 3'],
    ],
  },
};

export function createRound(year, level) {
  return questions[year][level].map(([prompt, correct, ...wrong], index) => {
    const options = [correct, ...wrong];
    const shift = (Number(year) + index + ['beginner', 'intermediate', 'advanced'].indexOf(level)) % 4;
    return { prompt, correct, options: [...options.slice(shift), ...options.slice(0, shift)] };
  });
}
