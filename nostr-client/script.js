import { SimplePool } from 'nostr-tools/pool'

const pool = new SimplePool()
const relays = ['wss://relay.damus.io', 'wss://relay.snort.social'];

const eventList = document.getElementById("event-list");

const events = [];

pool.subscribe(
  relays,
  {
    kinds: [1],
    limit: 2021,
  },
  {
    onevent(event) {
      const pow = countLeadingZeroes(event.id);

      const nonceTag = event.tags.find(tag => tag[0] === "nonce");
      const difficulty = nonceTag ? parseInt(nonceTag[2], 10) : null;

      if(pow > 0 && difficulty !== null && pow >= difficulty) {
        events.push({event, pow , difficulty});
        events.sort((a, b) => b.pow - a.pow);
        
        eventList.innerHTML = "";

        events.forEach(({ event, pow , difficulty}) => {
          const entry = document.createElement("div");
          entry.className = "note";

          entry.innerHTML = `
            <div><strong>PoW:</strong> ${pow} bits</div>
            <div><strong>Public key:</strong> ${event.pubkey}</div>
            <div><strong>Content:</strong> ${event.content}</div>
            <div><strong>Difficulty:</strong> ${difficulty}</div>
          `;

          eventList.appendChild(entry);

          console.log(event);
        });//not the best to re sort the list and recreate each element every time a new event is added is it :0 
      }
    }
  }
)

function countLeadingZeroes(hex) {
  let count = 0;
  for (let i = 0; i < hex.length; i++) {
    const nibble = parseInt(hex[i], 16);
    if (nibble === 0) {
      count += 4;
    } else {
      count += Math.clz32(nibble) - 28;
      break;
    }
  }
  return count;
}
