using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;


public class IntakeDmg : MonoBehaviour
{
    
    [SerializeField] int maxHealth;
    int currentHealth;

    public HealthBar healthBar;

    public UnityEvent OnDeath;

    public float safeTime = 2f;
    float safeTimeCooldown;


    public static Action OnPlayerDeath;
    public static Action OnEnemyDeath;
    private void OnEnable()
    {
        OnDeath.AddListener(Death);
    }

    private void OnDisable()
    {
        OnDeath.RemoveListener(Death);
    }

    private void Start()
    {
        currentHealth = maxHealth;
        //added for player
        if (this.CompareTag("Player"))
        {
            healthBar.UpdateBar(currentHealth, maxHealth);
        }

    }
    
    public void TakeDam(int damage)
    {
        if (safeTimeCooldown <= 0)
        {
            
            currentHealth -= damage;

            if (currentHealth <= 0)
            {
                currentHealth = 0;
                OnDeath.Invoke();
            }
            safeTimeCooldown = safeTime;
            //added for player
            if (this.CompareTag("Player"))
            {
                healthBar.UpdateBar(currentHealth, maxHealth);
            }
        }
    }

    public void Death()
    {
        Destroy(gameObject);

        if(this.CompareTag("Player"))
        {
            Time.timeScale = 0;
            OnPlayerDeath?.Invoke();
        }
        else
        {
            OnEnemyDeath?.Invoke();
        }
    }

    private void Update()
    {
        safeTimeCooldown -= Time.deltaTime;
    }
}
