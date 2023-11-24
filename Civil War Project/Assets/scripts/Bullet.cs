using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bullet : MonoBehaviour
{
    
    public int minDamage;
    public int maxDamage;
    public bool PlayerBullet;

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.CompareTag("Player") && !PlayerBullet)
        {
            int damage = Random.Range(minDamage, maxDamage);
            collision.GetComponent<Player>().TakeDamage(damage);
            Destroy(gameObject);
            
        }

        if (collision.CompareTag("Enemy") && PlayerBullet)
        {
            int damage = Random.Range(minDamage, maxDamage);
            
            collision.GetComponent<Enemycontroller>().TakeDamage(damage);
            Destroy(gameObject);
            
            
        }
    }
}
